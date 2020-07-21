module.exports.contentSet = (sectionTitle, sectionVideoTitle, sectionVideoUrl) => {
    let content = []
    let sectionVt = []
    let sectionVu = []
    let sectionT = sectionTitle.filter((value, index) => sectionTitle.indexOf(value) == index);

    for (let i = 0; i < sectionT.length; i++) {
        for (let j = 0; j < sectionTitle.length; j++) {
            if (sectionTitle[sectionVideoTitle.indexOf(sectionVideoTitle[j])] == sectionT[i] && sectionTitle[sectionVideoUrl.indexOf(sectionVideoUrl[j])] == sectionT[i]) {
                sectionVt.push(sectionVideoTitle[j]);
                sectionVu.push(sectionVideoUrl[j]);
            }
        }
        content.push({
            sectionTitle: sectionT[i],
            sectionVideoTitle: sectionVt,
            sectionVideoUrl: sectionVu
        })
        sectionVt = []
        sectionVu = []
    }
    return content
}