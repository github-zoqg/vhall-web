import Emitter from 'tiny-emitter'

const emitter = new Emitter()

emitter.$on = emitter.on;
emitter.$once = emitter.once;
emitter.$emit = emitter.emit;
emitter.$off = emitter.off;

export default emitter;
