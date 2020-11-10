declare namespace kavenegar {
    interface IOptions {
        host?: string;
        version?: string;
        /**
         * apikey :
         * Get apikey form the user panel Or talk to the technical department for guidance
         */
        apikey: string;
    }

    interface IEntrie {
        messageid: 8792343,
        message: string,
        status: number,
        statustext: string,
        sender: string,
        receptor: string,
        date: number,
        cost: number
    }

    type IResponseK<T = any, Y = IEntrie[]> = (data: T, callback: (entries: Y, status: number, message: string) => void) => void

    type IMethod = 'method' | 'sendarray' | 'status' | 'statuslocalmessageid' | 'select' | 'selectoutbox' | 'latestoutbox' | 'countoutbox' | 'cancel' | 'receive' | 'countinbox' | 'countpostalcode' | 'sendbypostalcode' | 'lookup' | 'info' | 'config' | 'maketts'

    interface Kavenegar {
        request: (action: 'sms', method: IMethod, params: object, callback) => void;
        Send: IResponseK<{ message: string; sender: number; receptor: string }>;
        SendArray: IResponseK;
        Status: IResponseK;
        StatusLocalMessageid: IResponseK;
        Select: IResponseK;
        SelectOutbox: IResponseK
        LatestOutbox: IResponseK
        CountOutbox: IResponseK
        Cancel: IResponseK
        Receive: IResponseK
        CountInbox: IResponseK
        CountPostalCode: IResponseK
        SendByPostalCode: IResponseK
        AccountInfo: IResponseK
        AccountConfig: IResponseK
        CallMakeTTS: IResponseK
    }

    function KavenegarApi(options: kavenegar.IOptions): Kavenegar { }

};

export = kavenegar;
