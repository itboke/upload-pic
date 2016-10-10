(function(win,doc){

    win.upload = {
        default:{
            class:'',
            id:''
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
                _files.forEach(function(file,i){
                    //http://blog.csdn.net/zk437092645/article/details/8745647 [TML5学习之FileReader接口]
                    var _reader = new FileReader();
                    //将文件读取为DataURL
                    _reader.readAsDataURL(file);
                    _reader.onload = function(){
                        var _params = _SELF._dataSet(_SELF._file,_SELF);
                        var _result = this.result;
                        _SELF._upload(_params,_result,file.type);
                    }

                })
            });
        },
        //上传到服务器
        _upload:function(obj,_result,type){
            var _SELF = this,
                _data = {};

            for (var key in obj) {
                if (key !== 'luploader') {
                    if (obj[key] == 'basestr') {
                        _data[key] = _result;
                    } else {
                        _data[key] = obj[key];
                    }
                }
            };
            _data =_SELF._serializeObject(_data);
            //创建ajax
            var _xhr = new XMLHttpRequest();
            //建立请求
            _xhr.open('post','http://localhost/upload/upload.php',true);
            _xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            _xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            //发送请求
            _data?_xhr.send(_data):_xhr.send()
            //请求回答
            _xhr.onreadystatechange = function(){
                if(_xhr.readyState == 4){
                    if(_xhr.status == 200){
                        console.log(_xhr.responseText)
                    }else{
                        console.log('fault')
                    }
                }
            }
        },
        //序列化
        _serializeObject:function(obj){
            if (typeof obj === 'string') return obj;
            var resultArray = [];
            var separator = '&';
            var isArray  = function(arr){
                if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
                else return false;
            };
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (isArray(obj[prop])) {
                        var toPush = [];
                        for (var i = 0; i < obj[prop].length; i++) {
                            toPush.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop][i]));
                        }
                        if (toPush.length > 0) resultArray.push(toPush.join(separator));
                    } else {
                        resultArray.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
                    }
                }

            }
            return resultArray.join(separator);
        },
        //获取el属性
        _dataSet:function(el,_this){
            var _SELF   = _this;
            var dataset = {};
            for (var i = 0; i < el.attributes.length; i++) {
                var attr = el.attributes[i];
                if (attr.name.indexOf('data-') >= 0) {
                    dataset[_SELF._toCamelCase(attr.name.split('data-')[1])] = attr.value;
                }
            }
            return dataset;
        },
        _toCamelCase:function(string){
            return string.toLowerCase().replace(/-(.)/g, function(match, group1) {
                return group1.toUpperCase();
            });
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
        class:'file-pipe'
    });
})(window,document)
