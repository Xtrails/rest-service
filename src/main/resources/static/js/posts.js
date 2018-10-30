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
    '<div class="post-form">' +
        '<h5 class="grey-text center-align">Новый пост</h5>'+
        '<form class="col s12">' +
            '<div class="row">' +
                '<div class="input-field col s12">' +
                    '<input id="title" value="Alvin" type="text" v-model="title">' +
                    '<label class="active" for="title">Заголовок</label>' +
                '</div>' +
                '<div class="input-field col s12">' +
                    '<textarea id="content" class="materialize-textarea" v-model="content"></textarea>' +
                    '<label for="content">Контент</label>' +
                    '<a class="waves-effect waves-light btn" @click="save">Сохранить</a>'+
                '</div>' +
            '</div>' +
        '</form>' +
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
        '<div class="post-form" id="{{post.id}}">' +
            '<div class="row">'+
                '<h5 class="grey-text center-align">{{post.title}}</h5>'+
                '<p>{{post.content}}</p>'+
                '<p>[id={{post.id}}, creationDate={{post.creationDate}}]</p>'+
                '<span>' +
                    '<a class="waves-effect waves-light btn" @click="edit">Изменить</a>'+
                    '<a class="del-button-post waves-effect red lighten-2 btn right-align" @click="del">Удалить</a>'+
                '</span>' +
            '</div>'+
        '</div>',
    methods: {
        edit: function () {
            this.editMethod(this.post);
        },
        del: function () {
            postApi.remove({id: this.post.id}).then(result => {
                if (result.ok) { //Результаты result ( https://github.com/pagekit/vue-resource/blob/develop/docs/http.md )
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
        '<div class="post-list">'+
        '<post-form :posts="posts" :postAttr="post"/>'+
        '<post-row v-for="post in posts" :post="post" :key="post.id" :editMethod="editMethod" :posts="posts"/>' +
        '</div>',
    methods:{
        editMethod:function (post) {
            this.post = post;
        }
    }
});

var app = new Vue({
    el: '#app',
    template:
    '<div>'+
        '<div v-if="!profile">Необходимо авторизоваться через <a href="/login">Google</a></div>'+
        '<div v-else>'+
            '<div>{{profile.name}}&nbsp;<a href="/logout">Выйти</a></div>'+
            '<posts-list :posts="posts" />'+
        '</div>'+
    '</div>',
    data: {
        posts: frontendData.posts,
        profile: frontendData.profile
    },
    created:function(){
        //postApi.get().then(result => result.json().then(data=> data.forEach(post => this.posts.push(post))))
    }
});