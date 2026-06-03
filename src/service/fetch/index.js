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
 * Ele mandar um request para mandar um email de recuperação
 * 
 * @param {string} email
 * @returns {Promise<boolean>}
 */
export async function fetchEmail( email ) {
    const res = await UFetch(env.serverApi,env.api.setEmail,"json",{ method: "POST", body:{email}});
    if(res.ok)
        return true;
    return false;
}

/**
 * Busca um arquivo como Blob.
 * @param {{
 *   id: number | string,
 *   type: "image" | "video" | "photo"
 * }} params
 * @returns {Promise<Blob>}
 */
export async function BFetch( id, type ) {
    if(type==="photo"){
        return await UFetch(env.serverApi,env.api.me,{ method:"GET" },)
    }
    if(type==="video"){
        return await UFetch(env.serverApi,env.api.me,{ method:"GET" },)
    }
    if(type==="image"){
        return await UFetch({ API_URL: env.serverApi, endPoint: `/serie/image/${id}`, options: { method:"GET", },type: "blob"});
    }
}

// ============ ADMIN FUNCTIONS ============

/**
 * Busca séries por nome
 * @param {string} query
 * @returns {Promise<any>}
 */
export async function searchSeries(query) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint: `/search?query=${encodeURIComponent(query)}`, 
        type: "json" 
    });
}

/**
 * Deleta uma série
 * @param {string|number} serieId
 * @returns {Promise<any>}
 */
export async function deleteSeries(serieId) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint: `/admin/serie/${serieId}`, 
        type: "json",
        options: { method: "DELETE" }
    });
}

/**
 * Faz upload de imagem para uma série
 * @param {string|number} serieId
 * @param {File} file
 * @returns {Promise<any>}
 */
export async function uploadSerieImage(serieId, file) {
    const formData = new FormData();
    formData.append('SerieImage', file);
    
    const res = await fetch(`${env.serverApi}/admin/upload/serie-image/${serieId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Erro ao fazer upload da imagem');
    }
    
    return await res.json();
}

/**
 * Define uma série como hero
 * @param {string|number} serieId
 * @returns {Promise<any>}
 */
export async function setSeriesAsHero(serieId) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint: `/admin/serie/${serieId}/hero`, 
        type: "json",
        options: { method: "PUT" }
    });
}

/**
 * Carrega episódios de uma série
 * @param {string|number} serieId
 * @returns {Promise<any>}
 */
export async function loadEpisodesBySerieId(serieId) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint: `/admin/serie/${serieId}/episodes-metadata`, 
        type: "json"
    });
}

// ============ EPISODE FUNCTIONS ============

/**
 * Cria um novo episódio
 * @param {object} episodeData
 * @returns {Promise<any>}
 */
export async function createEpisode(episodeData) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint: `/admin/episode`, 
        type: "json",
        options: { 
            method: "POST",
            body: episodeData
        }
    });
}

/**
 * Atualiza um episódio existente
 * @param {string|number} episodeId
 * @param {object} episodeData
 * @returns {Promise<any>}
 */
export async function updateEpisode(episodeId, episodeData) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint: `/admin/episode/${episodeId}`, 
        type: "json",
        options: { 
            method: "PUT",
            body: episodeData
        }
    });
}

/**
 * Deleta um episódio
 * @param {string|number} episodeId
 * @returns {Promise<any>}
 */
export async function deleteEpisode(episodeId) {
    return await UFetch({ 
        API_URL: env.serverApi, 
        endPoint: `/admin/episode/${episodeId}`, 
        type: "json",
        options: { method: "DELETE" }
    });
}

/**
 * Faz upload de vídeo para um episódio
 * @param {number} episodeId
 * @param {number} SerieId
 * @param {File} file
 * @returns {Promise<any>}
 */
export async function uploadEpisodeVideo(serieId,episodeId, file) {
    const formData = new FormData();
    formData.append('EpisodeVideo', file);
    
    const res = await fetch(`${env.serverApi}/admin/upload/episode-video/${episodeId}/${serieId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Erro ao fazer upload do vídeo');
    }
    
    return await res.json();
}

/**
 * Faz upload de metadados para um episódio
 * @param {string|number} episodeId
 * @param {object} metadata
 * @returns {Promise<any>}
 */
export async function uploadEpisodeMetadata(episodeId, metadata) {
    const res = await fetch(`${env.serverApi}/admin/upload/episode-metadata/${episodeId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
    });
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Erro ao fazer upload dos metadados');
    }
    
    return await res.json();
}

export default { UFetch, fetchEmail, BFetch, searchSeries, deleteSeries, uploadSerieImage, setSeriesAsHero, loadEpisodesBySerieId, createEpisode, updateEpisode, deleteEpisode, uploadEpisodeVideo, uploadEpisodeMetadata }