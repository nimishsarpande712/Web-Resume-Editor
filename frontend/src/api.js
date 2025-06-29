const API_URL = "https://web-resume-editor.onrender.com";

export async function aiEnhance(section, content) {
    const response = await fetch(`${API_URL}/ai-enhance`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ section, content }),
    });
    const data = await response.json();
    return data.enhanced;    
}

export async function saveResume(resume) {
    const response = await fetch(`${API_URL}/save-resume`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(resume),
    });
    return await response.json();
}

export async function getResume() {
    const response = await fetch(`${API_URL}/get-resume`);
    return response.json();
}

export async function downloadResume(resume, format) {
    try {
        const response = await fetch(`${API_URL}/export-resume/${format}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resume),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to download resume: ${errorData}`);
        }

        let blob;
        if (format === 'json') {
            const data = await response.json();
            blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        } else if (format === 'docx') {
            blob = await response.blob();
        } else if (format === 'pdf') {
            blob = await response.blob();
        }

        if (!blob) {
            throw new Error('Failed to create file blob');
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.name.replace(/\s+/g, '_')}_resume.${format}`;
        
        // Append link to body, click it, and remove it
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up the URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
}
