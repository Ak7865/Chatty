import './detail.css';
import { db } from './../../lib/firebase';
import { auth } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import { doc, arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore';

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();
    const handleBlock = async () => {
        if (!user) return;
        const userDocRef = await doc(db, "users", currentUser.id);
        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();
        } catch (error) {
            console.log("Error blocking user:", error);
        }
    }
    return (
        <div className='detail'>
            <div className="user">
                <img src={(isCurrentUserBlocked) ? "./avatar.png" : user?.avatar} alt="" />
                <h2>{user?.username}</h2>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./send.jpg" alt="" />
                                <span>send.jpg</span>
                            </div>
                            <img src="./download.png" alt="" className='icon' />
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="./send.jpg" alt="" />
                                <span>send.jpg</span>
                            </div>
                            <img src="./download.png" alt="" className='icon' />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}</button>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}

export default Detail;