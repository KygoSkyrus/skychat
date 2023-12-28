export const dbUsers=[
    {
        "email": "test1@email.com",
        "username": "test1",
        "avatar": "avatar 1",
        "time": {
            "seconds": 1703573630,
            "nanoseconds": 822000000
        },
        "id": "C6SeAcv7VjpcBhz34nFN"
    },
    {
        "email": "dg@email.com",
        "name": "dg",
        "avatar": "dfsj",
        "id": "HTkuXCR31YoYjJGMTuL6"
    },
    {
        "avatar": "avatar 1",
        "email": "test2@email.com",
        "username": "test2",
        "time": {
            "seconds": 1703573154,
            "nanoseconds": 60000000
        },
        "id": "KzGL2i757kkhf4spaAxr"
    },
    {
        "username": "test7",
        "avatar": "avatar 1",
        "email": "test7@email.com",
        "time": {
            "seconds": 1703574683,
            "nanoseconds": 439000000
        },
        "id": "R2kuiyWb2Q2ssEMq09lg"
    },
    {
        "username": "Superuser",
        "time": {
            "seconds": 1703570892,
            "nanoseconds": 643000000
        },
        "email": "superuser@email.com",
        "avatar": "avatar 1",
        "id": "TYzBnKFqdUM3rWTCgLnS"
    },
    {
        "username": "itsdg",
        "email": "dg@email.com",
        "time": {
            "seconds": 1703351953,
            "nanoseconds": 128000000
        },
        "avatar": "avatar 1",
        "id": "WvX7BmKNtO6LzwzTRIRA"
    },
    {
        "email": "test6@email.com",
        "avatar": "avatar 1",
        "time": {
            "seconds": 1703574372,
            "nanoseconds": 385000000
        },
        "username": "test6",
        "id": "X1kpSc6QCdNZu56lF5RV"
    },
    {
        "email": "test4@email.com",
        "username": "test4",
        "time": {
            "seconds": 1703573884,
            "nanoseconds": 856000000
        },
        "avatar": "avatar 1",
        "id": "Z1DtQ9Lha8K8MQOBWSaZ"
    },
    {
        "username": "test3",
        "email": "test3@email.com",
        "time": {
            "seconds": 1703573687,
            "nanoseconds": 197000000
        },
        "avatar": "avatar 1",
        "id": "cwsxnlWtsvB7P9PAnjO0"
    },
    
]

export function getDateStr(date) {
    let d = new Date(date)
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear())
}
export function getFullDateStr(date) {
    let m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let d = new Date(date)
    return d.getDate() + " " + (m[d.getMonth()]) + " " + (d.getFullYear()) + ", " + (d.getHours() < 12 ? d.getHours() : d.getHours() - 12) + ":" + (d.getMinutes()) + " " + (d.getHours() < 12 ? "AM" : "PM")
}

export function getExactTimeStr(d) {
    //let d = new Date(date)
    return (
          (d.getHours()===0 ? 12 : 
           (d.getHours() <= 12 ? 
            d.getHours() : 
            d.getHours() - 12) )
          + ":" + 
          (d.getMinutes()) 
          + " "  + 
          (d.getHours() < 12 ? "AM" : "PM")
        )
}