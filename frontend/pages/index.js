import { useState, useEffect } from "react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  
  useEffect(() => {
    fetch("http://localhost:8000/api/sales-reps")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Response is not ok: ", res.statusText);
        }
      })
      .then((data) => {
        setUsers(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleAskQuestion = async () => {
    try {
      setAnswer("Loading...");
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error in AI request:", error);
    }
  };

  const handleEnterKey = e => {
    if (e.key === "Enter") {
      handleAskQuestion();
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Next.js + FastAPI Sample</h1>

      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <section>
            <h2>Ask a Question (AI Endpoint)</h2>
            <div>
              <input
                type="text"
                placeholder="Enter your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyUp={handleEnterKey}
              />
              <button onClick={handleAskQuestion}>Ask</button>
            </div>
            {answer && (
              <div style={{ marginTop: "1rem" }}>
                <strong>AI Response:</strong> {answer}
              </div>
            )}
          </section>
          <section>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <table width={"100%"}>
                  <tbody>
                    {users.map((user, rowIdx) => (
                      <tr style={{ 
                        backgroundColor: (rowIdx % 2 == 0) ? "#e8d5a0" : "#a0c5e8",
                      }}>
                        <td style={{
                          verticalAlign: "top",
                          padding: "10px",
                        }}>
                          <p><strong>Name:</strong> {user.name}</p>
                          <p><strong>Role:</strong> {user.role}</p>
                          <p><strong>Region:</strong> {user.region}</p>
                          <div>
                            <strong>Skills:</strong>
                            <div>
                              <ul>
                                {user.skills?.map((skill, skillIdx) => (
                                  <li key={skillIdx}>{skill}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td style={{
                          verticalAlign: "top",
                          padding: "10px",
                        }}>
                          <div>
                            <strong>Clients:</strong>
                            <div>
                              <ul>
                                {user.clients?.map((client, clientIdx) => {
                                  const deals = user.deals?.filter(deal => deal.client === client.name) || [];
                                  
                                  return (
                                    <li key={clientIdx}>
                                      <div>
                                        {client.name} ({client.industry}): {client.contact}
                                      </div>
                                      <div style={{ marginLeft: "10px" }}>
                                        Deals: {deals.length < 1 ? (
                                          <>-</>
                                        ) : (
                                          <ul>
                                            {deals.map((deal, dealIdx) => (
                                              <li key={dealIdx}>{deal.status}: {deal.value}</li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        </td>
                        <td style={{
                          verticalAlign: "top",
                          padding: "10px",
                        }}>
                          <div>
                            <strong>Deals:</strong>
                            <div>
                              <ul>
                                {user.deals?.map((deal, dealIdx) => (
                                  <li key={dealIdx}>{deal.client} ({deal.status}): {deal.value}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
