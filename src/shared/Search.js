import React from 'react'
import _ from 'lodash'

const Search = () => {

    const onChange = (e) => {
        console.log(e.target.value)
        debounce(e);
    }

    const debounce = _.debounce((e) => {
        console.log(e.target.value)
    }, 1000)

    const throttle = _.throttle((e) => {
        console.log(e.target.value)
    }, 1000)

    return(
        <div>
            <input type="text" onChange={onChange}></input>
        </div>
    )
}

export default Search;