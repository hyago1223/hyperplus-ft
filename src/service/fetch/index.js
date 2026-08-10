import { envs as env } from "@/lib/env";

/**
 * Um fetch Universal para qualquer Requisição no BackEnd retornando
 * uma promisse pela requisição feita na API_URL
 * 
 * @param {{
 *   API_URL: string,
 *   endPoint: string,
 *   type?: string,
 *   options?: RequestInit,
 * }} params
 * @returns {Promise<Response>}
 */
export async function UFetch({ API_URL, endPoint, type, options = {}, isNoCredentials }) {
    const res = await fetch(`${API_URL}${endPoint}`,{
        credentials: isNoCredentials? "omit" : "include",
        method: options.method || "GET",
        ...options,
        headers: {
            ...(options.body? {"Content-Type": "application/json"} : {}),
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if(!res.ok){
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Error no Servidor");
    }
    if(type==="blob"){
        const blob = await res.blob();
        return blob;
    }
    if(type==="json"){
        const json = await res.json().catch(() => null);
        return json;
    }
    return res;
}

/**
 * Envia um request para mandar um email de recuperação
 * 
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function fetchEmail( email ) {
    return await crudOperation(env.api.user.setForgotEmail, "POST", { email })
        .then(() => true)
        .catch(() => false);
}

/**
 * Busca um arquivo como Blob.
 * @param {string|number} id
 * @param {"image" | "video" | "photo"} type
 * @returns {Promise<Blob>}
 */
export async function BFetch( id, type ) {
    if(type === "photo") {
        return await UFetch({ API_URL: env.serverApi, endPoint: env.api.user.photo, type: "blob" });
    }
    if(type === "image") {
        const endPoint = replaceRouteParams(env.api.serie.image, { serieId: id });
        return await UFetch({ API_URL: env.serverApi, endPoint, type: "blob" });
    }
    throw new Error(`Tipo de arquivo desconhecido: ${type}`);
}

// ============ HELPER FUNCTIONS ============

/**
 * Substitui parâmetros em uma rota
 * @param {string} route - Rota com placeholders (ex: "/user/:id")
 * @param {object} params - Objeto com parâmetros (ex: { id: 123 })
 * @returns {string}
 */
function replaceRouteParams(route, params = {}) {
    let result = route;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, value);
    });
    return result;
}

/**
 * Função genérica para upload de arquivos
 * @param {string} endPoint
 * @param {string} fieldName
 * @param {File} file
 * @returns {Promise<any>}
 */
async function uploadFile(endPoint, fieldName, file) {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const res = await fetch(`${env.serverApi}${endPoint}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Erro ao fazer upload do arquivo');
    }
    
    return await res.json();
}

/**
 * Função genérica para operações CRUD
 * @param {string} endPoint
 * @param {string} method
 * @param {object} body
 * @returns {Promise<any>}
 */
async function crudOperation(endPoint, method = "GET", body = null) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint,
        type: "json",
        options: { method, ...(body && { body }) }
    });
}

// ============ SEARCH FUNCTIONS ============

export const searchSeries = (query) => 
    crudOperation(`${env.api.search}?query=${encodeURIComponent(query)}`);

// ============ ADMIN - SERIE FUNCTIONS ============

export const deleteSeries = (serieId) => 
    crudOperation(`${env.api.admin.serie}/${serieId}`, "DELETE");

export const setSeriesAsHero = (serieId) => 
    crudOperation(`${env.api.admin.serie}/${serieId}/hero`, "PUT");

export const loadEpisodesBySerieId = (serieId) => 
    crudOperation(`${env.api.admin.serie}/${serieId}/episodes-metadata`);

export const uploadSerieImage = (serieId, file) => 
    uploadFile(replaceRouteParams(env.api.admin.uploadSerieImage, { serieId }), 'SerieImage', file);

export const createSerie = (serieData) => 
    crudOperation(env.api.admin.serie, "POST", serieData);

// ============ ADMIN - EPISODE FUNCTIONS ============

export const createEpisode = (episodeData) => 
    crudOperation(env.api.admin.episode, "POST", episodeData);

export const updateEpisode = (episodeId, episodeData) => 
    crudOperation(replaceRouteParams(`${env.api.admin.episode}/:episodeId`, { episodeId }), "PUT", episodeData);

export const deleteEpisode = (episodeId) => 
    crudOperation(replaceRouteParams(`${env.api.admin.episode}/:episodeId`, { episodeId }), "DELETE");

export const uploadEpisodeVideo = (serieId, episodeId, file) => 
    uploadFile(replaceRouteParams(env.api.admin.uploadEpisodeVideo, { episodeId, serieId }), 'EpisodeVideo', file);

export const uploadEpisodeMetadata = (episodeId, metadata) => 
    uploadFile(replaceRouteParams(env.api.admin.uploadEpisodeMetadata, { episodeId }), 'metadata', 
        new File([JSON.stringify(metadata)], 'metadata.json', { type: 'application/json' }));

export default { 
    UFetch, 
    fetchEmail, 
    BFetch, 
    searchSeries, 
    deleteSeries, 
    uploadSerieImage, 
    setSeriesAsHero, 
    loadEpisodesBySerieId, 
    createEpisode, 
    updateEpisode, 
    deleteEpisode, 
    uploadEpisodeVideo, 
    createSerie, 
    uploadEpisodeMetadata 
}