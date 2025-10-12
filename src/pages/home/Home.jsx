import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../features/context/AppContext";

export default  function Home() {
    const {request, backUrl} = useContext(AppContext);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        request("/api")
        .then(setGroups)
        .catch(console.error);
    }, []);

    return <>        
        <div className="text-center">
            
        </div>
        {/* <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
            {groups.map(group => <div key={group.id} className="col">
                <Link className="nav-link h-100" to={"Category/" + group.slug}>
                    <div className="card h-100">
                        <img src={backUrl + "/STORAGE/Item/" + group.imageUrl} className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">{group.name}</h5>
                            <p className="card-text">{group.description}</p>
                        </div>
                        <div className="card-footer bg-transparent">Товарів: --</div>
                    </div>
                </Link>
            </div>)}
        </div> */}
    </>;
}