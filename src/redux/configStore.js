import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createBrowserHistory } from "history";
import { connectRouter } from "connected-react-router";

import User from "./modules/user";
import Post from "./modules/post";
import Image from "./modules/image";

export const history = createBrowserHistory();

//리듀서 하나로 묶기
const rootReducer = combineReducers({
    user: User,
    post: Post,
    image: Image,
    router: connectRouter(history),
    // 우리의 만든 히스토리와 라우터가 연결이 되서 스토어에 저장이된다. 리덕스에서 히스토리 쓸수있다.
  });

// 청크 미들웨어 준비
const middlewares = [thunk.withExtraArgument({history:history})];
// 미들웨어 실행되고 그다음에 비동기로 히스토리 쓸 수 있다.

// 지금이 어느 환경인 지 알려줘요. (개발환경, 프로덕션(배포)환경 ...)
const env = process.env.NODE_ENV;

// 개발환경에서는 로거라는 걸 하나만 더 써볼게요.
if (env === "development") {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

// v8엔진은 브라우저 말고도 다른데서도 돌아가기 때문에 브라우저에서만 devtools 쓰게함
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

// 미들웨어 묶기
const enhancer = composeEnhancers(applyMiddleware(...middlewares));

// 스토어 만들기
let store = (initialStore) => createStore(rootReducer, enhancer);

export default store();

