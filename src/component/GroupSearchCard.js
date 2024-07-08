import React, { useState, useEffect } from 'react';
import { FaObjectGroup } from 'react-icons/fa';
import { getDownloadURL, getStorage, ref } from "firebase/storage"; // Assuming group avatars are stored in Firebase Storage

const GroupSearchCard = ({ group, onClose, onGroupClick }) => {
    const [clicked, setClicked] = useState(false);
    const [groupImageUrl, setGroupImageUrl] = useState('');

    const handleClick = () => {
        onGroupClick(group);
        setClicked(true);
    };

    useEffect(() => {
        const fetchGroupImage = async () => {
            try {
                const storage = getStorage();
                const groupImageRef = ref(storage, `groups/${group.id}.jpg`); // Assuming image filename format
                const downloadURL = await getDownloadURL(groupImageRef);
                setGroupImageUrl(downloadURL);
            } catch (error) {
                console.error('Error fetching group image:', error);
            }
        };

        if (group.imageUrl) { // Check if group has an imageUrl property
            fetchGroupImage();
        }
    }, [group]); // Dependency array includes `group` to refetch on group change

    return (
        <div onClick={handleClick} className={`group-search-card ${clicked ? 'clicked' : ''}`}>
            <div className="group-card">
                <div className="group-avatar">
                    {groupImageUrl ? (
                        <img src={groupImageUrl} alt={group.name} className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                    ) : (
                        <FaObjectGroup size={40} className="rounded-circle" />
                    )}
                </div>
                <div className="group-info">
                    <h5 className="group-name">{group.name}</h5>
                </div>
            </div>
        </div>
    );
};

export default GroupSearchCard;
