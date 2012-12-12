function dbEscape(str) {
    str = new String (str);

    str = str.replace(/\'/g,"''");
    str = str.replace(/\n\r/g,'\n');
    str = str.replace(/\r\n/g,'\n');

    return str;
}