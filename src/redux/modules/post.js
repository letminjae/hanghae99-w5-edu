import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import { firestore } from '../../shared/firebase';
import moment from 'moment'
import { storage } from '../../shared/firebase';
import { actionCreators as imageActions } from './image';

//액션
const SET_POST = 'SET_POST';
const ADD_POST = 'ADD_POST';

// 액션생성함수
const setPost = createAction(SET_POST, (post_list) => ({ post_list }))
const addPost = createAction(ADD_POST, (post) => ({ post }))

//초기값
const initialState = {
    list: [],
}

const initialPost = {
    // id: 0,
    // user_info: {
    //     user_name: '민재',
    //     user_profile: 'http://img.insight.co.kr/static/2018/09/12/700/z7n04ul8ig3y27w6l6ok.jpg',
    // },
    image_url: 'http://img.insight.co.kr/static/2018/09/12/700/z7n04ul8ig3y27w6l6ok.jpg',
    contents: '',
    comment_cnt: 0,
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
}

// 미들웨어
const getPostFB = () => {
    return function (dispatch, getState, { history }) {
        // 파이어스토어에 있는 post란 이름의 콜렉션 불러오기
        const postDB = firestore.collection('post');

        postDB.get().then((docs) => {
            let post_list = [];
            docs.forEach((doc) => {
                // 파이어스토어에서 가지고 온 데이터들을 _post로 선언
                let _post = doc.data();

                // 키값만 뽑아서(Object.keys 이용) 배열로 만들어줌 예를 들어 ['comment_cnt', 'post_id'] 이런식으로..
                let post = Object.keys(_post).reduce((acc, cur) => {
                    // 값에 user_ 이란 단어가 포함되어있으면, 새배열 만들어 user_info에 reduce 시켜라
                    if (cur.indexOf('user_') !== -1) {
                        return { ...acc, user_info: { ...acc.user_info, [cur]: _post[cur] } }
                    }
                    // if조건 충족시키면 남아잇는 현재값들은 새배열에 넣어라
                    return { ...acc, [cur]: _post[cur] }
                }, { id: doc.id, user_info: {} }
                )
                post_list.push(post)
            })

            dispatch(setPost(post_list))
        })
    }
}

const addPostFB = (contents='', ) => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection('post')
        const _user = getState().user.user;

        const user_info = {
            user_name: _user.user_name,
            user_id : _user.uid,
            user_profile : _user.user_profile,
        }

        const _post = {
            ...initialPost,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
        }

        const _image = getState().image.preview

        const _upload = storage.ref(`images/{user_info.user_id}_${new Date().getTime()}`).putString(_image, 'data_url')

        _upload.then(snapshot => {
            snapshot.ref.getDownloadURL().then(url =>{
                console.log(url);

                return url;
            }).then(url => {
                postDB.add({...user_info, ..._post, image_url: url}).then((doc) => {
                    let post = {user_info, ..._post, id: doc.id}
                    dispatch(addPost(post))
                    history.replace('/');
                    dispatch(imageActions.setPreview(null));
                }).catch((err) => {window.alert('앗! 포스트 작성에 문제가 있어요!', err)});
            }).catch((err) => {
                window.alert('앗! 이미지 업로드에 문제가 있어요!')
                console.log('앗! 이미지 업로드에 문제가 있어요!', err);
            })
        });
    }
}

// 리듀서
export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {
            draft.list = action.payload.post_list;
        }),

        [ADD_POST]: (state, action) => produce(state, (draft) => {
            draft.list.unshift(action.payload.post);
        }),
    }, initialState
);

const actionCreators = {
    setPost,
    addPost,
    getPostFB,
    addPostFB,
}

export { actionCreators };