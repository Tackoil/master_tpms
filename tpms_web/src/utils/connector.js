import axios from "axios";

export function journalSave(valueDict) {
    return axios.post('http://localhost:8000/journal_save/', valueDict,
        )
        .then(function (response) {
            return(response.status === 200)
        })
        .catch(function (error) {
            console.log(error)
            return false
        })
}

export function journalListGet(query, resultFunc) {
    if(query === undefined) query = '';
    axios.get(`http://localhost:8000/journal_list_get/?q=${query}`,
    )
        .then(function (response) {
            if(response.status === 200){
                console.info(response.data)
                resultFunc(response.data.map((item) => Object.assign(item["fields"], {"uid": item["pk"]})))
            }
        })
        .catch(function (error) {
            console.log(error)
            resultFunc([])
        })
}


export function getDataByUid(input) {
    if (input === 'a00000001') {
        return {
            uid: 'a00000001',
            thesisOrPaper: 'thesis',
            title: '基于AAA的BBB在CCC上的DDD',
            author: [{uid: '000001', name: '小明明'}],
            mentor: {uid: 'm00001', name: '大明明'},
            type: {uid: 'type1', name: '理论'},
            date: '',
            rate: 23.4,
            intro: '这一次对话的间隔时间很长，字幕有二十分钟没有出现，伊文斯已经从船首踱到船尾了。他看到有一队鱼不断地从海里跃出，在海面上方划出一条在星光下银光闪闪的弧线。几年前，为了考察过度捕捞对沿海物种的影响，他曾经在南中国海的渔船上待过一段时间，渔民们把这种景象叫“龙兵过”，伊文斯现在感觉那很像映在海洋瞳孔上的字幕。这时，他自己眼睛中的字幕也出现了。',
            keyword: [
                {uid: 'k000001', name: 'AAA'},
                {uid: 'k000002', name: 'BBB'},
                {uid: 'k000003', name: 'CCC'},
            ],
            topic: [
                {uid: 't000001', name: 'TTT1'},
                {uid: 't000002', name: 'TTT2'},
            ],
            project: [
                {uid: 'p123345', name: '基于123345的543321'},
                {uid: 'p234456', name: '基于234456的654432'},
            ],
            outcome: [
                {uid: 'o12', name: 'o12'},
            ],
            favor: false,
        };
    } else if (input === 'a00000002') {
        return {
            uid: 'a00000002',
            thesisOrPaper: 'paper',
            title: '基于EEE的FFF在GGG上的HHH',
            author: [
                {uid: '000001', name: '小明明'},
                {uid: '000002', name: '伊文斯'},
                {uid: '000003', name: '大史'}
            ],
            mentor: {uid: 'm00001', name: '大明明'},
            comAuthor: {uid: 'm00001', name: '大明明'},
            journal: {uid: 'j123', name: '期刊J'},
            date: '',
            intro: '罗辑伸手挥挥，像抚摸天鹅绒般感受着黑暗的质感，“宇宙就是一座黑暗深林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都小心翼翼，他必须小心，因为林中到处都有与他一样潜行的猎人。如果他发现了别的生命，不管是不是猎人，不管是天使还是恶魔，不管是娇嫩的婴儿还是步履蹒跚的老人，也不管是天仙般的少女还是天神般的男孩，能做的只有一件事：开枪消灭之。在这片深林中，他人就是地狱，就是永恒的威胁，任何暴露自己存在的生命都将很快被消灭。这就是宇宙文明的图景，这就是费米悖论的解释。”',
            keyword: [
                {uid: 'k000004', name: 'DDD'},
                {uid: 'k000005', name: 'EEE'},
                {uid: 'k000006', name: 'FFF'},
            ],
            topic: [
                {uid: 't000003', name: 'TTT3'},
                {uid: 't000002', name: 'TTT2'},
            ],
            with: {
                withInduc: true,
                withGov: false,
                withInt: false,
                withInterd: true,
            },
            project: [
                {uid: 'p123345', name: '基于123345的543321'},
                {uid: 'p234456', name: '基于234456的654432'},
            ],
            outcome: [
                {uid: 'o12', name: 'o12'},
            ],
            favor: true,
        };
    } else return null;
}

export function getQueryResult() {
    return [{
        uid: 'a00000001',
        thesisOrPaper: 'thesis',
        title: '基于AAA的BBB在CCC上的DDD',
        author: [{uid: '000001', name: '小明明'}],
        date: '',
        intro: '这一次对话的间隔时间很长，字幕有二十分钟没有出现，伊文斯已经从船首踱到船尾了。他看到有一队鱼不断地从海里跃出，在海面上方划出一条在星光下银光闪闪的弧线。几年前，为了考察过度捕捞对沿海物种的影响，他曾经在南中国海的渔船上待过一段时间，渔民们把这种景象叫“龙兵过”，伊文斯现在感觉那很像映在海洋瞳孔上的字幕。这时，他自己眼睛中的字幕也出现了。',
        keyword: [
            {uid: 'k000001', name: 'AAA'},
            {uid: 'k000002', name: 'BBB'},
            {uid: 'k000003', name: 'CCC'},
        ],
        favor: false,
    },
        {
            uid: 'a00000002',
            thesisOrPaper: 'paper',
            title: '基于EEE的FFF在GGG上的HHH',
            author: [
                {uid: '000001', name: '小明明'},
                {uid: '000002', name: '伊文斯'},
                {uid: '000003', name: '大史'}
            ],
            data: '',
            intro: '罗辑伸手挥挥，像抚摸天鹅绒般感受着黑暗的质感，“宇宙就是一座黑暗深林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都小心翼翼，他必须小心，因为林中到处都有与他一样潜行的猎人。如果他发现了别的生命，不管是不是猎人，不管是天使还是恶魔，不管是娇嫩的婴儿还是步履蹒跚的老人，也不管是天仙般的少女还是天神般的男孩，能做的只有一件事：开枪消灭之。在这片深林中，他人就是地狱，就是永恒的威胁，任何暴露自己存在的生命都将很快被消灭。这就是宇宙文明的图景，这就是费米悖论的解释。”',
            keyword: [
                {uid: 'k000004', name: 'DDD'},
                {uid: 'k000005', name: 'EEE'},
                {uid: 'k000006', name: 'FFF'},
            ],
            favor: true,
        }];
}
