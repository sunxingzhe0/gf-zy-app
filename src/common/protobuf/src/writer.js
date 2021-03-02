module.exports=Writer;var util=require('./util');var LongBits;var BufferWriter;var base64;var utf8=require('./utf8');function Op(fn,len,val){this.fn=fn;this.len=len;this.next=undefined;this.val=val}function noop(){}function State(writer){this.head=writer.head;this.tail=writer.tail;this.len=writer.len;this.next=writer.states}function Writer(){this.len=0;this.head=new Op(noop,0,0);this.tail=this.head;this.states=null}Writer.create=util.Buffer?function create_buffer_setup(){return(Writer.create=function create_buffer(){return new BufferWriter()})()}:function create_array(){return new Writer()};Writer.alloc=function alloc(size){return new util.Array(size)};if(util.Array!==Array)Writer.alloc=util.pool(Writer.alloc,util.Array.prototype.subarray);Writer.prototype._push=function push(fn,len,val){this.tail=this.tail.next=new Op(fn,len,val);this.len+=len;return this};function writeByte(val,buf,pos){buf[pos]=val&255}function writeVarint32(val,buf,pos){while(val>127){buf[pos++]=val&127|128;val>>>=7}buf[pos]=val}function VarintOp(len,val){this.len=len;this.next=undefined;this.val=val}VarintOp.prototype=Object.create(Op.prototype);VarintOp.prototype.fn=writeVarint32;Writer.prototype.uint32=function write_uint32(value){this.len+=(this.tail=this.tail.next=new VarintOp((value=value>>>0)<128?1:value<16384?2:value<2097152?3:value<268435456?4:5,value)).len;return this};Writer.prototype.int32=function write_int32(value){return value<0?this._push(writeVarint64,10,LongBits.fromNumber(value)):this.uint32(value)};Writer.prototype.sint32=function write_sint32(value){return this.uint32((value<<1^value>>31)>>>0)};function writeVarint64(val,buf,pos){while(val.hi){buf[pos++]=val.lo&127|128;val.lo=(val.lo>>>7|val.hi<<25)>>>0;val.hi>>>=7}while(val.lo>127){buf[pos++]=val.lo&127|128;val.lo=val.lo>>>7}buf[pos++]=val.lo}Writer.prototype.uint64=function write_uint64(value){var bits=LongBits.from(value);return this._push(writeVarint64,bits.length(),bits)};Writer.prototype.int64=Writer.prototype.uint64;Writer.prototype.sint64=function write_sint64(value){var bits=LongBits.from(value).zzEncode();return this._push(writeVarint64,bits.length(),bits)};Writer.prototype.bool=function write_bool(value){return this._push(writeByte,1,value?1:0)};function writeFixed32(val,buf,pos){buf[pos]=val&255;buf[pos+1]=val>>>8&255;buf[pos+2]=val>>>16&255;buf[pos+3]=val>>>24}Writer.prototype.fixed32=function write_fixed32(value){return this._push(writeFixed32,4,value>>>0)};Writer.prototype.sfixed32=Writer.prototype.fixed32;Writer.prototype.fixed64=function write_fixed64(value){var bits=LongBits.from(value);return this._push(writeFixed32,4,bits.lo)._push(writeFixed32,4,bits.hi)};Writer.prototype.sfixed64=Writer.prototype.fixed64;Writer.prototype.float=function write_float(value){return this._push(util.float.writeFloatLE,4,value)};Writer.prototype.double=function write_double(value){return this._push(util.float.writeDoubleLE,8,value)};var writeBytes=util.Array.prototype.set?function writeBytes_set(val,buf,pos){buf.set(val,pos)}:function writeBytes_for(val,buf,pos){for(var i=0;i<val.length;++i)buf[pos+i]=val[i]};Writer.prototype.bytes=function write_bytes(value){var len=value.length>>>0;if(!len)return this._push(writeByte,1,0);if(util.isString(value)){var buf=Writer.alloc(len=utf8.length(value));utf8.write(value,buf,0);value=buf}return this.uint32(len)._push(writeBytes,len,value)};Writer.prototype.string=function write_string(value){var len=utf8.length(value);return len?this.uint32(len)._push(utf8.write,len,value):this._push(writeByte,1,0)};Writer.prototype.fork=function fork(){this.states=new State(this);this.head=this.tail=new Op(noop,0,0);this.len=0;return this};Writer.prototype.reset=function reset(){if(this.states){this.head=this.states.head;this.tail=this.states.tail;this.len=this.states.len;this.states=this.states.next}else{this.head=this.tail=new Op(noop,0,0);this.len=0}return this};Writer.prototype.ldelim=function ldelim(){var head=this.head,tail=this.tail,len=this.len;this.reset().uint32(len);if(len){this.tail.next=head.next;this.tail=tail;this.len+=len}return this};Writer.prototype.finish=function finish(){var head=this.head.next,buf=this.constructor.alloc(this.len),pos=0;while(head){head.fn(head.val,buf,pos);pos+=head.len;head=head.next}return buf};Writer._configure=function(){LongBits=require("./longBits");base64=require('./base64');utf8=require('./utf8')};