import './addUser.css';
import { db } from '../../../../lib/firebase';
import { useUserStore } from "./../../../../lib/userStore";
import { useState } from 'react';
import { collection, getDocs, query, serverTimestamp, doc, setDoc, where, arrayUnion } from 'firebase/firestore';

const AddUser = () => {
    const { currentUser } = useUserStore();
    const [user, setUser] = useState(null);
    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));
            const querySnapShot = await getDocs(q);
            if (!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }
        } catch (error) {
            console.error("Error searching for user:", error);
        }
    };
    const handleAdd = async () => {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");
        try {
            const newChatRef = doc(chatRef);
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });
            await setDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    receiverId: currentUser.id,
                    lastMessage: "",
                    updatedAt: Date.now(),
                }),
            }, { merge: true });
            await setDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    receiverId: user.id,
                    lastMessage: "",
                    updatedAt: Date.now(),
                }),
            }, { merge: true });
        } catch (error) {
            console.log("Error adding user:", error);
        }
    }
    return (
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" name="username" id="username" placeholder='username' />
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="detail">
                    <img src={user.avatar || "./avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    )
}

export default AddUser;