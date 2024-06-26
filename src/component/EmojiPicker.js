import { Picker } from 'emoji-mart';
const EmojiPicker = ({ onEmojiClick }) => {
    return (
        <Picker onSelect={onEmojiClick} />
    );
};

export default EmojiPicker;
