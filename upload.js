/*
 * 移动端图片上传
*/
(function(win,doc){
    win.upload = {
        default:{
            el:'',
            action:''
        },
        init:function(opts){
            var _SELF = this;
            //复制参数对象
            _SELF.default = _SELF._copy(opts);
            //初始化选择对象
            _SELF._file = _SELF._querySelect();
            //监听事件
            _SELF._post();
        },
        //监听文件事件
        _post:function(){
            var _SELF = this;
            _SELF._file.addEventListener('change',function(){
                if (!this.files.length) return;
                var _files = Array.prototype.slice.call(this.files);
                var _name  = this.getAttribute('name');
                _files.forEach(function(file,i){
                    var _isType = _SELF._checkFileType(file.type);
                    if(!_isType){
                        alert('上传的文件类型有误');
                        return false;
                    }
                    _SELF.default['file'] = file;
                    _SELF.default['name'] = _name;
                    _SELF._upload(_SELF.default);
                })
            });
        },
        //判断文件类型
        _checkFileType:function(_type){
            var _allowType = ['image/jpeg','image/png','image/bmp'];
            for(var i=0,l = _allowType.length; i<l; i++)
            {
                if(_allowType[i] === _type){
                    return true;
                }
            }
            return false;
        },
        //上传到服务器
        _upload:function(option){

            if(typeof XMLHttpRequest === 'undefined'){
                return;
            }

            var _SELF = this;
            var formData = new FormData();
            formData.append(option.name,option.file);
            //创建ajax
            var _xhr = new XMLHttpRequest();
            //上传进度
            if(_xhr.upload){
                _xhr.upload.onprogress = function progress(e){
                    if (e.total > 0) {
                        e.percent = e.loaded / e.total * 100;
                    }
                }
            }
            _xhr.onerror = function error(e){
                console.log(e);
            }
            _xhr.onload  = function onload(){
                //判断上传状态
                if(_xhr.status < 200 || _xhr.status >= 300){
                    var msg = 'cannot post ' + option.action + ' ' + _xhr.status + '\'';
                    var err = new Error(msg);
                    err.status = _xhr.status;
                    err.method = 'post';
                    err.url = option.action;
                    console.log(err);
                    return err;
                }
                var _text = _xhr.responseText || _xhr.response;
                if(!_text){
                    return _text
                }
                try{
                    console.log(JSON.parse(_text));
                }catch(e){
                    return _text;
                }
            }
            //建立请求
            _xhr.open('post',option.action,true);
            _xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            //发送请求
            formData?_xhr.send(formData):_xhr.send()
        },
        //复制参数对象
        _copy:function(opts){
            var _SELF = this;
            for(var key in _SELF.default){
                _SELF.default[key] = opts[key] || '';
            }
            return _SELF.default;
        },
        //选择器
        _querySelect:function(){
            var _SELF = this;
            if(!_SELF.default['el']) return;
            if(_SELF.default['el'].indexOf('#')>-1){
                return doc.getElementById(_SELF.default['el'].replace('#',''));
            }
            return doc.querySelector(_SELF.default['el']);
        }
    };
    upload.init({
        el:'.file-pipe',
        action:'http://localhost/upload-pic/upload.php'
    });
})(window,document)
