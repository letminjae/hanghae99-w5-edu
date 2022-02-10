import { createAction, handleActions } from 'redux-actions'
import { produce } from 'immer'
import { firestore } from '../../shared/firebase';
import moment from 'moment'
import { storage } from '../../shared/firebase';
import { actionCreators as imageActions } from './image';

//액션
const SET_POST = 'SET_POST';
const ADD_POST = 'ADD_POST';
const EDIT_POST = 'EDIT_POST';
const LOADING = "LOADING";
const DELETE_POST = 'DELETE_POST';

// 액션생성함수
const setPost = createAction(SET_POST, (post_list, paging) => ({ post_list, paging }))
const addPost = createAction(ADD_POST, (post, direction) => ({ post, direction }))
const editPost = createAction(EDIT_POST, (post_id, post) => ({ post_id, post }))
const loading = createAction(LOADING, (is_loading) => ({ is_loading }))
const deletePost = createAction(DELETE_POST, (post_list) => ({ post_list }))

//초기값
const initialState = {
    list: [],
    paging: { start: null, next: null, size: 3 }, // 무한스크롤 - 페이징 정보 초기값
    is_loading: false,
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
    direction: 'center',
    likes: 0,
}

// 미들웨어
const editPostFB = (post_id = null, post = {}) => {
    return function (dispatch, getState, { history }) {
        if (!post_id) {
            console.log('게시물정보가 없어요')
            return;
        }
        const _image = getState().image.preview;
        const _post_i = getState().post.list.findIndex(a => a.id === post_id)
        const _post = getState().post.list[_post_i]

        console.log(_post)

        const postDB = firestore.collection('post')

        if (_image === _post.image_url) {
            postDB.doc(post_id).update(post).then(doc => {
                dispatch(editPost(post_id, { ...post }))
                history.replace('/')
            });

            return;
        } else {
            const user_id = getState().user.user.uid;
            const _upload = storage.ref(`images/${user_id}_${new Date().getTime()}`).putString(_image, "data_url");

            _upload.then((snapshot) => {
                snapshot.ref.getDownloadURL().then((url) => {

                    return url;
                })
                    .then((url) => {
                        postDB.doc(post_id).update({ ...post, image_url: url }).then((doc) => {
                            dispatch(editPost(post_id, { ...post, image_url: url }));
                            history.replace("/");
                        });
                    })
                    .catch((err) => {
                        window.alert("앗! 이미지 업로드에 문제가 있어요!");
                        console.log("앗! 이미지 업로드에 문제가 있어요!", err);
                    });
            });

        }
    }
}


const getPostFB = (start = null, size = 3) => {
    return function (dispatch, getState, { history }) {

        let _paging = getState().post.paging;

        if (_paging.start && !_paging.next) {
            return;
        }

        dispatch(loading(true));

        // 파이어스토어에 있는 post란 이름의 콜렉션 불러오기
        const postDB = firestore.collection('post');

        let query = postDB.orderBy("insert_dt", 'desc');

        if (start) {
            query = query.startAt(start);
        }



        query.limit(size + 1).get().then(docs => {
            let post_list = [];
            let paging = {
                start: docs.docs[0],
                next: docs.docs.length === size + 1 ? docs.docs[docs.docs.length - 1] : null,
                size: size,
            }
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
            });

            post_list.pop();

            dispatch(setPost(post_list, paging))
        })

    }
}

const addPostFB = (contents = '', direction) => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection('post')
        const _user = getState().user.user;

        const user_info = {
            user_name: _user.user_name,
            user_id: _user.uid,
            user_profile: _user.user_profile,
        }

        const _post = {
            ...initialPost,
            contents: contents,
            direction: direction,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
            likes: 0,
        }

        const _image = getState().image.preview

        const _upload = storage.ref(`images/{user_info.user_id}_${new Date().getTime()}`).putString(_image, 'data_url')

        _upload.then(snapshot => {
            snapshot.ref.getDownloadURL().then(url => {

                return url;
            }).then(url => {
                postDB.add({ ...user_info, ..._post, image_url: url }).then((doc) => {
                    let post = { user_info, ..._post, id: doc.id, image_url: url }
                    dispatch(addPost(post))
                    history.replace('/');

                    dispatch(imageActions.setPreview(null));

                }).catch((err) => { window.alert('앗! 포스트 작성에 문제가 있어요!', err) });
            }).catch((err) => {
                window.alert('앗! 이미지 업로드에 문제가 있어요!')
                console.log('앗! 이미지 업로드에 문제가 있어요!', err);
            })
        });
    }
}

const getOnePostFB = (id) => {
    return function (dispatch, getState, { history }) {
        const postDB = firestore.collection("post")
        postDB.doc(id).get().then(doc => {
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

            dispatch(setPost([post]))
        })
    }
}

const deletePostFB = (post_id = null) => {
    return function (dispatch, getState, { history }) {

        const postDB = firestore.collection("post");

        postDB.doc(post_id).delete().then((doc) => {
            console.log("게시물 삭제 완료")
        
            dispatch(deletePost(post_id))
            history.replace('/')
            window.location.reload()
        }).catch((err) => {
            console.log("게시물 삭제 실패!")
        })
    }
}



// 리듀서
export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {
            draft.list.push(...action.payload.post_list)

            draft.list = draft.list.reduce((acc, cur) => {
                if (acc.findIndex(a => a.id === cur.id) === -1) {
                    return [...acc, cur];
                } else {
                    acc[acc.findIndex(a => a.id === cur.id)] = cur;
                    return acc;
                }
            }, []);

            if (action.payload.paging) {
                draft.paging = action.payload.paging;
            }
            draft.is_loading = false;
        }),

        [ADD_POST]: (state, action) => produce(state, (draft) => {
            draft.list.unshift(action.payload.post);
        }),

        [EDIT_POST]: (state, action) => produce(state, (draft) => {
            let i = draft.list.findIndex((p) => p.id === action.payload.post_id);

            draft.list[i] = { ...draft.list[i], ...action.payload.post }
        }),
        [LOADING]: (state, action) => produce(state, (draft) => {
            draft.is_loading = action.payload.is_loading;
        }),
        [DELETE_POST]: (state, action) => produce(state, (draft) => {
            draft.list = draft.list.filter((p, i) => p.id !== action.payload.post_id)
        }),
    }, initialState
);

const actionCreators = {
    setPost,
    addPost,
    getPostFB,
    addPostFB,
    editPost,
    editPostFB,
    getOnePostFB,
    deletePostFB,
}

export { actionCreators };