import { useState } from "react";
const toMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;


export default function Status() {
    const [status, setStatus] = useState({});
    const checkStatus = async () => {
        try {
          const data = await UFetch({ API_URL: env.serverApi, endPoint: `/admin/server-status`, type: "json" });
          if (data && data.data) {
            setStatus({
              backEnd: data.data,
              success: true,
            });
          } else {
            setStatus({ success: false });
          }
        } catch (error) {
          console.error("Erro ao buscar status:", error);
          setStatus({ success: false, error: error.message });
        }
      };
    
        useEffect(()=>{
            const interval = setInterval(checkStatus, 10000);
            return () => clearInterval(interval);
        },[windows])
    return (
        <section>
            <h3>1. Status do Servidor</h3>
            {status.success ? (
                <div>
                <h2>Servidor BackEnd está <span style={{ color: 'green' }}>Conectado ✓</span></h2>
                <div className="backend-status-container">
                    <h2 className="section-title"> Status do BackEnd</h2>
                    <div className="status-grid">
                    <div className="card">
                        <h3 className="card-label">Status do App</h3>
                        <p className={`card-value ${status.backEnd?.status === 'Online' ? 'success' : 'danger'}`}>{status.backEnd?.status || 'Offline'}</p>
                    </div>
                    <div className="card">
                        <h3 className="card-label">Banco de Dados</h3>
                        <p className={`card-value ${status.backEnd?.database === 'Connected' ? 'success' : 'danger'}`}>{status.backEnd?.database === 'Connected' ? 'Conectado' : 'Desconectado'}</p>
                    </div>
                    <div>
                        <h3>Uso do CPU</h3>
                        <p>
                        {status.backEnd?.cpu_usage ? `${((status.backEnd.cpu_usage.user + status.backEnd.cpu_usage.system) / 1000000).toFixed(2)}s`: '0.00s'}
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="card-label">Usuários Cadastrados</h3>
                        <p className="card-value">{status.backEnd?.People || 0}</p>
                    </div>
                    <div className="card">
                        <h3 className="card-label">Node Version</h3>
                        <p className="card-value highlight">{status.backEnd?.node_version || '-'}</p>
                    </div>
                    </div>
                    {status.backEnd?.memory && (() => {
                    const mem = status.backEnd.memory;
                    
                    const pctUsado = ((mem.used / (mem.total + mem.external)) * 100).toFixed(1);
                    const pctLivre = (((mem.total - mem.used) / (mem.total + mem.external)) * 100).toFixed(1);
                    const pctExterno = ((mem.external / (mem.total + mem.external)) * 100).toFixed(1);

                    return (
                        <div className="memory-section">
                        <h3 className="memory-title"> Memória do BackEnd</h3>
                        
                        <div className="progress-bar-container">
                            <div className="bar-segment used" style={{ width: `${pctUsado}%` }}>{pctUsado}%</div>
                            <div className="bar-segment free" style={{ width: `${pctLivre}%` }}>{pctLivre}%</div>
                            <div className="bar-segment external" style={{ width: `${pctExterno}%` }}>{pctExterno}%</div>
                        </div>

                        <div className="chart-legend">
                            <div className="legend-item"><span className="bullet used"></span> Heap Usado: <strong>{toMB(mem.used)}</strong></div>
                            <div className="legend-item"><span className="bullet free"></span> Heap Livre: <strong>{toMB((mem.total - mem.used))}</strong></div>
                            <div className="legend-item"><span className="bullet external"></span> Externo: <strong>{toMB(mem.external)}</strong></div>
                            <div className="legend-item"><span className="bullet rss"></span> RSS Total: <strong>{toMB(mem.rss)}</strong></div>
                        </div>
                        </div>
                    );
                    })()}
                </div>
                <div>
                    <h3>Informações do FrontEnd:</h3>
                    <div>
                    <h3>Uso de Memoria</h3>
                    </div>
                </div>
                </div>
            ) : (
                <div>
                <h2>Servidor BackEnd está <span style={{ color: 'red' }}>Desconectado ✗</span></h2>
                {status.error && <p style={{ color: 'red' }}>Erro: {status.error}</p>}
                </div>
            )}
            </section>
    );
}