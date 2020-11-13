// $('.div-common').append('<p>我我我我是aaa1111</p>')
/* 动态导入用import */
import ('jquery').then(({ default: $ }) => {
        console.log($, "看舒克舒克是")
    })
    // import $ from 'jquery'
    // // console.log($, "看舒克舒克是")
    // $(function() {
    //     $('.div-common').prepend("在开头追加文本");
    // })