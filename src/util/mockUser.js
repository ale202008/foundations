const mockTickets = [
    {
        ticket_id: uuid.v4(),
        amount: 100, 
        description: "I spent it all on movie tickets"
    },
    {
        ticket_id: uuid.v4(),
        amount: 100000, 
        description: "Listen, I think this coin will go to the moon!"
    },
]
const mockUser = {
    user_id: uuid.v4(),
    username: "testUser3",
    password: "testPassword",
    role: "financemanager",
    tickets: mockTickets
}

module.exports = mockUser;