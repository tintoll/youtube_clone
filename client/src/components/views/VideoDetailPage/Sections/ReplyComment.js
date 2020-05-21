import React,{useEffect, useState} from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {
    const videoId = props.videoId;

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComment, setOpenReplyComment] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        props.commentLists.map((comment) =>{
            if(comment.responseTo === props.parentCommentId) {
                commentNumber++;
            }
            setChildCommentNumber(commentNumber)
        })
    }, [props.commentLists])

    
    const renderReplyComment = (parentCommentId) => 
        props.commentLists.map((comment, index) => (            
            <React.Fragment>
            {
                comment.responseTo === parentCommentId &&                
                    <div style={{width:'80%', marginLeft:'40px'}} key={index}>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} videoId={videoId} />
                    <ReplyComment videoId={videoId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} commentLists={props.commentLists} />  
                    </div>
                
            }
            </React.Fragment>
        ))
    
    console.log(renderReplyComment)
    const handleChange = () => {
        setOpenReplyComment(!OpenReplyComment)
    }

    return (
        <div>
            {
                ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }}
                    onClick={handleChange} >
                    View {ChildCommentNumber} more comment(s)
             </p>
            }
            

            { OpenReplyComment 
                && renderReplyComment(props.parentCommentId)
            }
        </div>
    )
}

export default ReplyComment
