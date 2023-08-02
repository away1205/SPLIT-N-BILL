import { useState } from 'react';
import './index.css';
import initialFriends from './Friends';

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddUser, setShowAddUser] = useState(false);
  const [activeFriend, setActiveFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddUser(false);
  }

  function handleActiveFriend(friend) {
    setActiveFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddUser(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === activeFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setActiveFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          onActiveFriend={handleActiveFriend}
          friends={friends}
          activeFriend={activeFriend}
        />

        {showAddUser && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onIsOpen={setShowAddUser} showAddUser={showAddUser}>
          {showAddUser ? 'Close' : 'Add Friend'}
        </Button>
      </div>

      <FormSplitBill
        activeFriend={activeFriend}
        onSplitBill={handleSplitBill}
      />
    </div>
  );
}

function FriendsList({ onActiveFriend, friends, activeFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onActiveFriend={onActiveFriend}
          activeFriend={activeFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onActiveFriend, activeFriend }) {
  const isActive = activeFriend?.id === friend.id;

  return (
    <li className={isActive ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owe you ${friend.balance}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <button className='button' onClick={() => onActiveFriend(friend)}>
        {isActive ? 'close' : 'select'}
      </button>
    </li>
  );
}

function Button({ children, onIsOpen, showAddUser }) {
  return (
    <button className='button' onClick={() => onIsOpen(!showAddUser)}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(ev) {
    ev.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setImage('https://i.pravatar.cc/48');
    setName('');
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type='text'
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input
        type='text'
        value={image}
        onChange={(ev) => setImage(ev.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ activeFriend, onSplitBill }) {
  if (!activeFriend) return;

  const [bill, setBill] = useState('');
  const [userExpense, setUserExpense] = useState('');
  const [payer, setPayer] = useState('you');

  function handleSubmit(ev) {
    ev.preventDefault();

    if (!bill || !userExpense) return;
    onSplitBill(payer === 'you' ? bill - userExpense : -(bill - userExpense));
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {activeFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type='number'
        value={bill}
        onChange={(ev) => setBill(Number(ev.target.value))}
      />

      <label>👱 Your expense</label>
      {payer === 'you' ? (
        <input
          type='text'
          value={userExpense}
          onChange={(ev) =>
            setUserExpense(
              Number(ev.target.value) > bill
                ? userExpense
                : Number(ev.target.value)
            )
          }
        />
      ) : (
        <input type='text' disabled value={bill - userExpense} />
      )}

      <label>🧑‍🦰 {activeFriend.name}'s expense</label>
      {payer === activeFriend.name ? (
        <input
          type='text'
          value={userExpense}
          onChange={(ev) =>
            setUserExpense(
              Number(ev.target.value) > bill
                ? userExpense
                : Number(ev.target.value)
            )
          }
        />
      ) : (
        <input type='text' disabled value={bill - userExpense} />
      )}

      <label>🤑 Who is paying the bill?</label>
      <select value={payer} onChange={(ev) => setPayer(ev.target.value)}>
        <option value='you'>You</option>
        <option value={activeFriend.name}>{activeFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
