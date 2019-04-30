export class Base {
    public currentUrl = window.location.href;
    public adminDBName = "OPTIPROADMIN";
    
    public getCurrentUrl(){
        let temp: any = this.currentUrl.substring(0, this.currentUrl.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1') {
                temp = temp.substring(0, temp.lastIndexOf('#'));
        }
        return temp;
    }

}