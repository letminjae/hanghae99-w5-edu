import React, { useState, useRef, useEffect } from 'react';
import { Grid, Text, Button, Image, Input } from '../elements'
import Upload from '../shared/Upload'
import { useSelector, useDispatch } from 'react-redux';
import { actionCreators as postActions } from '../redux/modules/post';
import { actionCreators as imageActions } from '../redux/modules/image';


const PostWrite = (props) => {
    const is_login = useSelector((state) => state.user.is_login); // 로그인 되었는지? 안되었으면 글 못씀
    const post_list = useSelector((state) => state.post.list); // 게시물 목록 
    const preview = useSelector((state) => state.image.preview); // 이미지 미리보기
    const is_uploading = useSelector((state) => state.image.uploading); //이미지가 업로드 되었는지?

    const { history } = props; //리덕스에 히스토리 불러와서 페이지 이동가능
    const dispatch = useDispatch(); //디스패치 써서 리덕스에 있는 액션들 리듀서로 가게하여 동작시킴

    const fileInput = useRef(); // fileInput은 렌더링시 고정

    //포스트 수정
    const post_id = props.match.params.id;
    const is_edit = post_id ? true : false;
    let _post = is_edit ? post_list.find((p) => p.id === post_id) : null

    const editPost = () => {
        dispatch(postActions.editPostFB(post_id, { contents: contents, direction: direction }));
    }

    React.useEffect(() => {
        if (is_edit && !_post) {
            console.log('포스트 정보가 없어요')
            history.goBack();
            return;
        }
        if (!is_edit){
            dispatch(imageActions.setPreview(""))
        }
        if (is_edit) {
            dispatch(imageActions.setPreview(_post.image_url))
        }
    }, []);

    const [contents, setContents] = useState(_post ? _post.contents : '');
    const [direction, setDirection] = useState('center');
    const [empty, setEmpty] = useState(fileInput.current ? true : false);

    const changeDirection = (e) => {
        setDirection(e.target.value);
    }

    const changeContents = (e) => {
        setContents(e.target.value)
    }

    const updatePost = () => {
        dispatch(postActions.addPostFB(contents, direction))
    }

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
    }

    if (!is_login) {
        return (
            <Grid margin="100px 0px" padding='16px' center>
                <Text size='32px' bold>앗! 잠깐</Text>
                <Text size='16px'>로그인 후에만 글을 쓸수 있어요!</Text>
                <Button _onClick={() => { history.replace("/") }}> 로그인 하러가기</Button>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <Grid padding='16px'>
                <Text margin='0px' size='36px' bold>{is_edit ? '게시글 수정' : '게시글 작성'}</Text>
                <Upload ref={fileInput} disabled={is_uploading} />
            </Grid>

            <Grid margin="3em 0;">
                <Text size="1.5em;" margin="20px 0px" bold>레이아웃 선택</Text>
                <input
                    type="radio"
                    value="right"
                    onChange={changeDirection}
                    checked={direction === "right" ? true : false}
                /> 오른쪽
                <Grid is_flex margin="1em 0 2em 0;">
                    <Text width="50%;" center>{contents}</Text>
                    <Grid width="500px;">
                        <Image shape="rectangle" src={preview ? preview : 'https://camfitt.com/static/media/empty.a5238aed.jpg'} />
                    </Grid>
                </Grid>
                <input
                    type="radio"
                    value="left"
                    onChange={changeDirection}
                    checked={direction === "left" ? true : false} />
                왼쪽
                <Grid is_flex margin="1em 0 2em 0;">
                    <Grid width="500px;">
                        <Image shape="rectangle" src={preview ? preview : 'https://camfitt.com/static/media/empty.a5238aed.jpg'} />
                    </Grid>
                    <Text width="50%" center>{contents}</Text>
                </Grid>
                <input
                    type="radio"
                    value="center"
                    onChange={changeDirection}
                    checked={direction === "center" ? true : false}
                /> 중앙
                <Grid margin="1em 0 2em 0;">
                    <Text margin=" 2em 0;">{contents}</Text>
                    <Image shape="rectangle" src={preview ? preview : 'https://camfitt.com/static/media/empty.a5238aed.jpg'} />
                </Grid>
            </Grid>
            <Grid>
                <Input
                    label="게시글 내용"
                    placeholder="내용을 작성해주세요"
                    _onChange={changeContents}
                    value={contents}
                    multiLine />

                {is_edit ? (
                    <Button _onClick={editPost} margin="10px 0;">수정</Button>
                ) : (
                    <Button _onClick={updatePost} margin="10px 0;" disabled={contents && empty ? false : true}>작성</Button>
                )}
            </Grid>
        </React.Fragment>
    )
}

export default PostWrite;