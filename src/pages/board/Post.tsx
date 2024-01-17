import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PostDto } from '../../dto/Post';
import { Card } from 'react-bootstrap';

const Post: React.FC = () => {
    const { postId } = useParams();
    console.log(postId);
    const [post, setPost] = useState<PostDto | null>(null);

    useEffect(() => {
        getPost(postId);
    }, [postId]);

    const getPost = async (id: string | undefined) => {
        const res = await axios.get(`http://localhost:8080/api/posts/${postId}`);
        console.log(res.data.data);
        setPost(res.data.data);
    };

    return (
        <>
            {post && (
                <Card style={{ width: '1200px', height: '550px', margin: '30 auto 30 auto' }}>
                    <Card.Body>
                        <Card.Title>{post.postTitle}</Card.Title>
                        <Card.Text>
                            {post.postContent}
                        </Card.Text>
                        <button>좋아요</button>
                        <button>싫어요</button>
                        <button>신고하기</button>
                    </Card.Body>
                </Card>
            )}
        </>
    );
};

export default Post;