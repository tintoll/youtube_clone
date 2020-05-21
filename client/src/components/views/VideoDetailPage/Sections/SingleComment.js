import React, {useState} from 'react'
import { Comment, Avatar } from 'antd'
import { useSelector } from 'react-redux';
import Axios from 'axios';

function SingleComment(props) {
    const user = useSelector(state => state.user);

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    

    const onSubmit = (event) => {
        event.preventDefault();
        const variable = {
            comment : CommentValue,
            writer : user.userData._id,
            videoId : props.videoId,
            responseTo : props.comment._id
        }
        // 글작성
        Axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if(response.data.success) {
                    setCommentValue("")
                    props.refreshFunction(response.data.result);
                }else {
                    alert('댓글 작성 실패')
                }
            })
    }

    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    const onclickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    const actions = [
        <span onClick={onclickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ];

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt="writer" />} 
                content={<p>{props.comment.content}</p>} 
            />

            {OpenReply &&             
                <form style={{ display:'flex' }} onSubmit={onSubmit}>
                    <textarea 
                        style={{ width : '100%',borderRadius : '5px'}}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성하여 주십시오."
                    />
                    <br />
                    <button style={{ width: '20%' , height : '52px'}} onClick={onSubmit}>Submit</button>
                </form>            
            }
        </div>
    )
}

export default SingleComment
