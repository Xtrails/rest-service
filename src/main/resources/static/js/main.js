var messageApi = Vue.resource("/message{/id}");

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
Vue.component('message-form', {
    props:['messages', 'messageAttr'],
    data: function(){
        return {
            text:'',
            id:''
        }
    },
    watch:{ //Метод наблюдатель ( https://ru.vuejs.org/v2/guide/computed.html#%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D1%8B-%D0%BD%D0%B0%D0%B1%D0%BB%D1%8E%D0%B4%D0%B0%D1%82%D0%B5%D0%BB%D0%B8 )
        messageAttr: function(newVal, oldVal){
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
    '<div>'+
        '<input type="text" placeholder="Write something" v-model="text"/>'+
        '<input type="button" value="Save" @click="save" />' +
    '</div>',
    methods:{
        save:function () {
            var message = {text:this.text};

            if(this.id){
                messageApi.update({id: this.id}, message).then(result=>
                    result.json().then(data=>{
                        var index = getIndex(this.messages, data.id);
                        this.messages.splice(index, 1, data);
                        this.text='';
                        this.id=''
                    })
                )
            } else {
                messageApi.save({},message).then(result=>
                    result.json().then(data=>{
                        this.messages.push(data);
                        this.text=''
                    })
                )
            }
        }
    }
});

//Компонент в котором выводится одно сообщение
Vue.component('message-row',{
    props: ['message','editMethod','messages'],
    template:
        '<div>' +
            '<i>({{message.id}})</i>{{message.text}}' +
            '<span style="position: absolute; right: 0">' +
                '<input type="button" value="Edit" @click="edit"/>' +
                '<input type="button" value="X" @click="del"/>' +
            '</span>' +
        '</div> ',
    methods:{
        edit: function () {
            this.editMethod(this.message);
        },
        del:function () {
            messageApi.remove({id: this.message.id}).then(result=>{
                if(result.ok){ //Результаты result ( https://github.com/pagekit/vue-resource/blob/develop/docs/http.md )
                    this.messages.splice(this.messages.indexOf(this.message), 1) //Удаляем объект из коллекции
                }
            })
        }
    }
});

//Компонент - лист сообщений из message-row
Vue.component('messages-list', {
    props:['messages'],
    data:function(){
        return {
            message:null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">'+
            '<message-form :messages="messages" :messageAttr="message"/>'+
            '<message-row v-for="message in messages" :message="message" :key="message.id" :editMethod="editMethod" :messages="messages"/>' +
        '</div>',
    methods:{
        editMethod:function (message) {
            this.message = message;
        }
    },
    created:function(){
        messageApi.get().then(result => result.json().then(data=> data.forEach(message => this.messages.push(message))))
    }
});

var app = new Vue({
    el: '#app',
    template:'<messages-list :messages="messages" />',
    data: {
        messages: []
    }
});