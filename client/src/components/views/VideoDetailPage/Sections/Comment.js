import React, {useState} from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux';

function Comment(props) {
    const videoId = props.videoId;
    const user = useSelector(state => state.user);
    const [commentValue, setcommentValue] = useState('')
    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();
        const variable = {
            comment : commentValue,
            writer : user.userData._id,
            videoId : videoId
        }
        // 글작성
        Axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data);
                }else {
                    alert('댓글 작성 실패')
                }
            })

    }
    return (
        <div>
            <br />
            <p> Replies</p> 
            <hr />

            {/* Comment List*/}

            {/* Root Comment form */}
            <form style={{ display:'flex' }} onSubmit={onSubmit}>
                <textarea 
                    style={{ width : '100%',borderRadius : '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성하여 주십시오."
                />
                <br />
                <button style={{ width: '20%' , height : '52px'}} onClick>Submit</button>
            </form>
        </div>
    )
}

export default Comment
