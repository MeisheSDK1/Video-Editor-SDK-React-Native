# 1、lib和src内容基本一致
如果需要修改，就去修改src中的内容，修改之后，在当前目录下，打开终端命令
执行tsc，如果你没有安装tsc，先去安装一下
如果你不安装那就去手动再去修改一遍lib下的ts和js文件

# 2、如果出现报错
Cannot find module 'react-native' or its corresponding type declarations.

可以执行一下命令：
yarn add --dev react-native

如果因为这个命令导致，该目录下package.json发生变化，不用提交，因为这个是插件

# 3、也可以在主工程（react-native-nvshortvideo-example）中直接修改插件代码，同样也需要执行第一步，修改之后要记得更新插件代码


# 1. The contents of lib and src are basically the same.
If you need to modify, modify the contents in src. After modification, open the terminal command in the current directory.
Execute tsc. If you don't have tsc installed, install it first.
If you don't install it, manually modify the ts and js files under lib again.

# 2. If an error occurs,
Cannot find module 'react-native' or its corresponding type declarations.

You can execute the following command:
yarn add --dev react-native

If package.json in this directory changes due to this command, you don't need to submit it because it is a plug-in.

# 3. You can also modify the plug-in code directly in the main project (react-native-nvshortvideo-example). You also need to execute the first step. Remember to update the plug-in code after modification.
