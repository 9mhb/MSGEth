// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract MSGETH {
    mapping(address => User) public UsersMap;
    mapping(address => Message[]) private MessagesMap;
    mapping(address => Message[]) private SentMessagesMap;
    mapping(address => uint256) private unreadMessagesCounter;
    mapping(address => uint256) private messageIdCounter;

    struct User {
        string username;
        uint256 currentCost;
    }

    struct Message {
        uint256 MessageId;
        address from;
        address payable to;
        string text;
        bool status;
        uint256 timeStamp;
        User sender;
        User reciever;
    }

    function isUser(address theirAddress) public view returns (bool) {
        return bytes(UsersMap[theirAddress].username).length > 0;
    }

    function addUser(string calldata _username) external {
        require(isUser(msg.sender) == false, "User already exists!");
        require(bytes(_username).length > 0, "Username cannot be empty!");
        UsersMap[msg.sender].username = _username;
    }

    function changeStatus(
        address user,
        uint256 _MessageId,
        bool status
    ) public {
        for (uint256 i = 0; i < MessagesMap[user].length; i++)
            if (MessagesMap[user][i].MessageId == _MessageId) {
                MessagesMap[user][i].status = status;
                address sender = MessagesMap[user][i].from;
                for (uint256 j = 0; j < SentMessagesMap[sender].length; j++)
                    if (SentMessagesMap[sender][j].MessageId == _MessageId) {
                        SentMessagesMap[sender][j].status = status;
                        break;
                    }
                break;
            }

        if (status == true) {
            UsersMap[user].currentCost -= 10000000000000 wei;
            unreadMessagesCounter[user]--;
        } else {
            UsersMap[user].currentCost += 10000000000000 wei;
            unreadMessagesCounter[user]++;
        }
    }

    function sendMessage(string memory _text, address payable _to)
        public
        payable
    {
        uint256 recentsentMsgId = messageIdCounter[_to]++;
        require(isUser(msg.sender), "Create an account first!");
        require(isUser(_to), "User is not registered!");
        require(
            msg.value >= UsersMap[_to].currentCost,
            "You don't have enough money to send this message!"
        );
        _to.transfer(msg.value);

        Message memory newMsg = Message(
            recentsentMsgId,
            msg.sender,
            _to,
            _text,
            false,
            block.timestamp,
            UsersMap[msg.sender],
            UsersMap[_to]
        );
        MessagesMap[_to].push(newMsg);
        SentMessagesMap[msg.sender].push(newMsg);

        UsersMap[_to].currentCost = UsersMap[_to].currentCost + 10000000000000;
        unreadMessagesCounter[_to]++;
    }

    function readMessage(address _myAddress)
        external
        view
        returns (Message[] memory)
    {
        return MessagesMap[_myAddress];
    }

    function readSentMessage(address _myAddress)
        external
        view
        returns (Message[] memory)
    {
        return SentMessagesMap[_myAddress];
    }

    function calculateUnreadMessages(address user)
        public
        view
        returns (uint256 counter)
    {
        for (uint256 i = 0; i < MessagesMap[user].length; i++)
            if (MessagesMap[user][i].status == false) counter++;

        return counter;
    }

    function calculateSentMessages(address user)
        public
        view
        returns (uint256 counter)
    {
        return SentMessagesMap[user].length;
    }

    function getUsername(address _to)
        public
        view
        returns (string memory _username)
    {
        string memory username = UsersMap[_to].username;
        return username;
    }

    function getUserInboxCost(address _to) public view returns (uint256 _cost) {
        uint256 cost = UsersMap[_to].currentCost;
        return cost;
    }
}
