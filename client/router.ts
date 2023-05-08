import { initStart } from "./pages/welcome/index";
import { initStartRoom } from "./pages/enter-room";
import { initStartName } from "./pages/enter-name";
import { initShareCodeRoom } from "./pages/share-code";
import { initWaitingRoom } from "./pages/waiting-room";
import { initFullRoom } from "./pages/full-room";
import { initRules } from "./pages/rules/index"
import { initPlays } from "./pages/play/index"
import { initResults } from "./pages/results/index"

const BASE_PATH = "/project-ppt-online";

function isGithubPages() {
    return location.host.includes("github.io");
}

function initRouter (container: Element | null){
    function goTo(path){
        const completePath = isGithubPages() ? BASE_PATH + path : path;
        history.pushState({}, "", completePath);
        handleRoute(completePath);
    }

    function handleRoute(route){
        const newRoute = isGithubPages() ? route.replace(BASE_PATH, "") : route;
        const routes = [
            {
                path: /\/inicio/,
                component: initStart
            },
            {
                path: /\/ingresar-room/,
                component: initStartRoom
            },
            {
                path: /\/ingresar-nombre/,
                component: initStartName
            },
            {
                path: /\/compartir-codigo/,
                component: initShareCodeRoom
            },
            {
                path: /\/sala-de-espera/,
                component: initWaitingRoom
            },
            {
                path: /\/sala-llena/,
                component: initFullRoom
            },
            {
                path: /\/reglas/,
                component: initRules
            },
            {
                path: /\/jugadas/,
                component: initPlays
            },
            {
                path: /\/resultados/,
                component: initResults
            }
        ];
        for(const r of routes){
            if(r.path.test(newRoute)){
                
                const el = r.component({ goTo: goTo });
                if(container?.firstChild){
                    container.firstChild.remove();
                }
                container?.appendChild(el);
            }
        }
    }
    if(location.pathname === "/" || location.host.includes("github.io")){
        goTo("/inicio")
    } else {
        handleRoute(location.pathname);
    }
    window.onpopstate = function (){
        handleRoute(location.pathname);
    }
}

export { initRouter }