/*
 * 移动端图片上传
*/
(function(win,doc){
    win.upload = {
        default:{
            class:'',
            id:'',
            action:''
        },
        init:function(opts){
            var _SELF = this;
            //复制参数对象
            _SELF.default = _SELF._copy(opts);
            //初始化选择对象
            _SELF._file = _SELF._querySelect();
            //监听事件
            _SELF._listener();
        },
        //监听文件事件
        _listener:function(){
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
            var _SELF = this;
            var formData = new FormData();
            formData.append(option.name,option.file);
            //创建ajax
            var _xhr = new XMLHttpRequest();
            //建立请求
            _xhr.open('post',option.action,true);
            _xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            //发送请求
            formData?_xhr.send(formData):_xhr.send()
            //请求回答
            _xhr.onreadystatechange = function(){
                if(_xhr.readyState == 4){
                    if(_xhr.status == 200){
                        console.log(_xhr.responseText)
                    }else{
                        alert('上传失败');
                    }
                }
            }
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
            var _isClass = _SELF.default['class']?true:_SELF.default['id']?false:-1;
            if(!_isClass && _isClass != -1){
                return doc.getElementById(_SELF.default['id']);
            }
            return doc.querySelector('.' + _SELF.default['class']);
        }
    };
    upload.init({
        class:'file-pipe',
        action:'http://localhost/upload-pic/upload.php'
    });
})(window,document)
