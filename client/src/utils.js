export const dbUsers=[
    {
        "avatar": "avatar 1",
        "email": "test11@gmail.com",
        "connections": {},
        "time": {
            "seconds": 1703787515,
            "nanoseconds": 693000000
        },
        "username": "test11",
        "id": "ATu05EC7f15DpEDjONtd"
    },
    {
        "avatar": "avatar 1",
        "email": "test1@email.com",
        "time": {
            "seconds": 1703573630,
            "nanoseconds": 822000000
        },
        "username": "test1",
        "id": "C6SeAcv7VjpcBhz34nFN"
    },
    {
        "name": "dg",
        "email": "dg@email.com",
        "avatar": "dfsj",
        "id": "HTkuXCR31YoYjJGMTuL6"
    },
    {
        "time": {
            "seconds": 1703573154,
            "nanoseconds": 60000000
        },
        "avatar": "avatar 1",
        "email": "test2@email.com",
        "username": "test2",
        "id": "KzGL2i757kkhf4spaAxr"
    },
    {
        "connections": {
            "test1": "86ea5a68-1218-4f50-9ed8-a2bb0b0343f0",
            "test2": "28af8297-dee3-420a-a683-7598381c9c7b",
            "test3": "78d94c47-9315-4c70-9266-4f0e3bcc904b",
            "Superuser": "19619960-8865-493c-9880-e5e0cb7af9a5"
        },
        "time": {
            "seconds": 1703690020,
            "nanoseconds": 712000000
        },
        "requests": {},
        "username": "test10",
        "avatar": "avatar 1",
        "email": "test10@gmail.com",
        "id": "PvBwKIDOrAeVTytUNTDr"
    },
    {
        "avatar": "avatar 1",
        "email": "test7@email.com",
        "time": {
            "seconds": 1703574683,
            "nanoseconds": 439000000
        },
        "username": "test7",
        "id": "R2kuiyWb2Q2ssEMq09lg"
    },
    {
        "avatar": "avatar 1",
        "username": "Superuser",
        "email": "superuser@email.com",
        "time": {
            "seconds": 1703570892,
            "nanoseconds": 643000000
        },
        "id": "TYzBnKFqdUM3rWTCgLnS"
    },
    {
        "username": "itsdg",
        "avatar": "avatar 1",
        "time": {
            "seconds": 1703351953,
            "nanoseconds": 128000000
        },
        "email": "dg@email.com",
        "id": "WvX7BmKNtO6LzwzTRIRA"
    },
    {
        "avatar": "avatar 1",
        "email": "test6@email.com",
        "username": "test6",
        "time": {
            "seconds": 1703574372,
            "nanoseconds": 385000000
        },
        "id": "X1kpSc6QCdNZu56lF5RV"
    },
    {
        "time": {
            "seconds": 1703573884,
            "nanoseconds": 856000000
        },
        "email": "test4@email.com",
        "avatar": "avatar 1",
        "username": "test4",
        "id": "Z1DtQ9Lha8K8MQOBWSaZ"
    },
    {
        "avatar": "avatar 1",
        "email": "test3@email.com",
        "username": "test3",
        "time": {
            "seconds": 1703573687,
            "nanoseconds": 197000000
        },
        "id": "cwsxnlWtsvB7P9PAnjO0"
    },
    {
        "username": "test9",
        "requests": {},
        "connections": {},
        "avatar": "avatar 2",
        "time": {
            "seconds": 1703671519,
            "nanoseconds": 485000000
        },
        "email": "test9@email.com",
        "id": "test9"
    }
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
          (d?.getHours()===0 ? 12 : 
           (d?.getHours() <= 12 ? 
            d?.getHours() : 
            d?.getHours() - 12) )
          + ":" + 
          (d?.getMinutes()) 
          + " "  + 
          (d?.getHours() < 12 ? "AM" : "PM")
        )
}