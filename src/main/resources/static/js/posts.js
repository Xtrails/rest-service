var postApi = Vue.resource("/post{/id}");

//Функция определения индекса в коллекции
function getIndex(list,id){
    for(var i = 0; i < list.length; i++ ){
        if(list[i].id === id){
            return i;
        }
    }
    return -1;
}

//Компонент формы для добавления нового сообщения
Vue.component('post-form', {
    props:['posts', 'postAttr'],
    data: function(){
        return {
            title:'',
            content:'',
            id:''
        }
    },
    watch:{ //Метод наблюдатель ( https://ru.vuejs.org/v2/guide/computed.html#%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D1%8B-%D0%BD%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D0%B8 )
        postAttr: function(newVal, oldVal){
            this.content = newVal.content;
            this.title = newVal.title;
            this.id = newVal.id;
        }
    },
    template:
        '<div>'+
        '<input type="text" placeholder="Write something" v-model="title"/>'+
        '<input type="text" placeholder="Write something" v-model="content"/>'+
        '<input type="button" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function () {
            var post = {title: this.title, content: this.content};

            if (this.id) {
                postApi.update({id: this.id}, post).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.posts, data.id);
                        this.posts.splice(index, 1, data);
                        this.title = '';
                        this.content = '';
                        this.id = ''
                    })
                )
            } else {
                postApi.save({}, post).then(result =>
                    result.json().then(data => {
                        this.posts.push(data);
                        this.content = '';
                        this.title = ''
                    })
                )
            }
        }
    }
});

//Компонент в котором выводится одно сообщение
Vue.component('post-row',{
    props: ['post','editMethod','posts'],
    template:
        '<div>' +
        '<i>({{post.id}})</i>{{post.text}}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="Edit" @click="edit"/>' +
        '<input type="button" value="X" @click="del"/>' +
        '</span>' +
        '</div> ',
    methods:{
        edit: function () {
            this.editMethod(this.post);
        },
        del:function () {
            postApi.remove({id: this.post.id}).then(result=>{
                if(result.ok){ //Результаты result ( https://github.com/pagekit/vue-resource/blob/develop/docs/http.md )
                this.posts.splice(this.posts.indexOf(this.post), 1) //Удаляем объект из коллекции
            }
        })
        }
    }
});

//Компонент - лист сообщений из post-row
Vue.component('posts-list', {
    props:['posts'],
    data:function(){
        return {
            post:null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">'+
        '<post-form :posts="posts" :postAttr="post"/>'+
        '<post-row v-for="post in posts" :post="post" :key="post.id" :editMethod="editMethod" :posts="posts"/>' +
        '</div>',
    methods:{
        editMethod:function (post) {
            this.post = post;
        }
    },
    created:function(){
        postApi.get().then(result => result.json().then(data=> data.forEach(post => this.posts.push(post))))
    }
});

var app = new Vue({
    el: '#app',
    template:'<posts-list :posts="posts" />',
    data: {
        posts: []
    }
});