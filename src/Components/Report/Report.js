const Report = ({reportData}) => {
    if (!reportData || reportData.length === 0) return null;

    let groupedByPid = groupBy(reportData, "parcel_id");
    let finalData = {...groupedByPid};

    for (const pid in groupedByPid) {
        let parcel_area = finalData[pid][0].parcel_area;
        let tree_types = convertArrayToObject(finalData[pid], 'tree_type');

        finalData[pid] = {
            area: parcel_area,
            trees: tree_types
        }
    }

    

    return (
        <div className={"report-data"}>
                {Object.keys(finalData).map(pid => {
                    let parcel = finalData[pid];
                    return (
                    <table className="report-table">
                        <tr key={"id_"+pid}>
                            <th>PID</th><th>{pid}</th>
                        </tr>
                        <tr key={"area_"+pid}>
                            <th>Total Area</th><th>{parcel.area} sqm</th>
                        </tr>
                        <tr>
                            <td colSpan={3}>Tree Composition</td>
                        </tr>
                            {Object.keys(parcel.trees).map(tree => {
                                let percentCoverage = (parcel.trees[tree].intersect_area/parcel.area)*100;
                                return (<tr key={"tree_"+tree}>
                                            <td>{tree}</td>
                                            <td>{Math.round(percentCoverage)}%</td>
                                        </tr>
                                        )
                                    })}
                    </table>
                    )
                })}
               
        </div>
    );
}

export default Report;




function groupBy(arr, propName) {
    return arr.reduce((r, a) => {
        r[a[propName]] = [...r[a[propName]] || [], a];
        return r;
       }, {});
}

const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };
  