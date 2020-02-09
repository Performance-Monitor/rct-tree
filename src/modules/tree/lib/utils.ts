// 判断数据类型异常
export function parseTypeOfValue(nameOfAcceptData: string,acceptData: any, requireType: any) {
    // 如果接收的数据不属于所需数据类型的实例，抛出TypeError
    if(!(acceptData instanceof requireType)){
        // console.log(`${nameOfAcceptData} requires a type ${requireType}, but accepts a type ${typeof acceptData}`);
        return new TypeError(`${nameOfAcceptData} requires a type ${requireType}, but accepts a type ${typeof acceptData}`)
    }
    // else console.log(`为可接收的数据`)
}