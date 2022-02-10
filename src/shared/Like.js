import React, { useEffect, useState } from "react";
import { Grid, Button, Text } from '../elements'
import { apiKey } from "./firebase";
import { history } from "../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as likesActions } from "../redux/modules/likes";


const Like = (props) => {
    // 로그인 안되면 좋아요 못누름
    const _sessionKey = `firebase:authUser:${apiKey}:[DEFAULT]`;
    const is_session = sessionStorage.getItem(_sessionKey) ? true : false

    // 어떤 유저가 좋아요 눌렀는지 알기위해
    const user_id = useSelector((state) => state.user?.uid)
    const id = props.id;

    // 좋아요 누른 콜렉션 리스트와 눌렀는지?
    const is_like = useSelector((state) => state.likes.is_like)
    const like_list = useSelector((state) => state.likes.list)
    const [getlikes, setGetLikes] = useState(false)

    const dispatch = useDispatch();

    // useEffect로 좋아요를 누른 유저가 유저 아이디에 포함되어 있다면, 디스패치 될때마다 좋아요 유지
    useEffect( () => {
        dispatch(likesActions.isLike(false));
        dispatch(likesActions.getLikeFB(id));

        if(like_list[id]?.includes(user_id)){
            setGetLikes(true)
        } else {
            setGetLikes(false);
        }
    },[dispatch])

    //좋아요 누르기 기능
    const clickLike = () => {
        if(!is_like){
            dispatch(likesActions.plusLikeFB(id, user_id))
            setGetLikes(true)
        }else{
            dispatch(likesActions.minusLikeFB(id, user_id))
            setGetLikes(false)
        }
    }

    const clickLogin = () => {
        history.push('/login')
    }

    return (
        <React.Fragment>
            {is_session ? (
                <Grid is_flex width='1.5em' _onClick={clickLike}>
                    {
                        getlikes ?
                            (<Text size="20px" margin="0px">❤</Text>)
                            :
                            (<Text size="20px" margin="0px">🤍</Text>)
                    }
                </Grid >
            ) : (
                <Grid is_flex width='2.5em' _onClick={clickLogin}>
                    {
                        getlikes ?
                        (<Text size="20px" margin="0px">❤</Text>)
                        :
                        (<Text size="20px" margin="0px">🤍</Text>)
                    }
                </Grid >
            )

            }
        </React.Fragment>
    )


}

export default Like

// 빈 하트를 post에 붙인다 view 설정
// 하트 채우기 안채우기는 중요하므로 state로 관리한다 getlikes
// 클릭을한다면 채워진하트가 나온다 _onClick={clickLike}
// 그런데 로그인안되어있다면 로그인 페이지로 간다 _onClick={clickLogin}
// 만약 클릭을 한다면 setGetLikes를 이용해 true가 되고, 다시 누르면 false가 된다
// 