import { useFileSystemStore } from './src/store/useFileSystemStore';

const store = useFileSystemStore.getState();
store.mkdir('/a/b/c');
const listRoot = store.list('/');
const listA = store.list('/a');
const listB = store.list('/a/b');
const listC = store.list('/a/b/c');
console.log('listRoot:', listRoot.map(n => n.path));
console.log('listA:', listA.map(n => n.path));
console.log('listB:', listB.map(n => n.path));
console.log('listC:', listC.map(n => n.path));
