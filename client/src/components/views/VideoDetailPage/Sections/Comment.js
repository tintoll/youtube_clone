import React, {useState} from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import { Button, Input } from 'antd';
import ReplyComment from './ReplyComment';
const { TextArea } = Input;

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
            content : commentValue,
            writer : user.userData._id,
            videoId : videoId
        }
        // 글작성
        Axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if(response.data.success) {
                    setcommentValue("")
                    props.refreshFunction(response.data.result);
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
            {props.commentLists && props.commentLists.map((comment, index) => 
               (!comment.responseTo 
                && 
                   <React.Fragment key={index}> 
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={videoId} />
                    <ReplyComment videoId={videoId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} commentLists={props.commentLists} />
                   </React.Fragment> 
                )
            )}
            


            {/* Root Comment form */}
            <form style={{ display:'flex' }} onSubmit={onSubmit}>
                <TextArea 
                    style={{ width : '100%',borderRadius : '5px'}}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="코멘트를 작성하여 주십시오."
                />
                <br />
                <Button style={{ width: '20%' , height : '52px'}} onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    )
}

export default Comment
