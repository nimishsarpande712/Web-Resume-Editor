import { useState, useEffect, useRef }  from "react";
import { aiEnhance } from "../api";
import styled from 'styled-components';
import { Paper, Button } from './StyledComponents';
import gsap from 'gsap';

const SectionContainer = styled(Paper)`
    margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
    font-size: 1.8rem;
    color: #f5f5dc;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(245, 245, 220, 0.3);
    
    &:before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background: linear-gradient(45deg, #f5f5dc, #ffd700);
        margin-right: 12px;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    }
    
    @media (max-width: 768px) {
        font-size: 1.6rem;
        margin-bottom: 1.2rem;
        
        &:before {
            width: 8px;
            height: 8px;
            margin-right: 10px;
        }
    }
    
    @media (max-width: 480px) {
        font-size: 1.4rem;
        margin-bottom: 1rem;
        
        &:before {
            width: 6px;
            height: 6px;
            margin-right: 8px;
        }
    }
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 16px;
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    color: #f5f5dc;
    font-size: 1rem;
    resize: vertical;
    min-height: 120px;
    margin-bottom: 1rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(255, 215, 0, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
        transition: left 0.6s ease;
    }

    &:focus {
        outline: none;
        border-color: rgba(255, 215, 0, 0.5);
        box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 0 20px rgba(255, 215, 0, 0.3),
            inset 0 0 0 1px rgba(255, 215, 0, 0.3);
        background: rgba(255, 255, 255, 0.12);
        transform: scale(1.02);
        
        &::before {
            left: 100%;
        }
    }

    &::placeholder {
        color: rgba(245, 245, 220, 0.6);
    }
    
    @media (max-width: 768px) {
        padding: 14px;
        font-size: 0.95rem;
        min-height: 100px;
        border-radius: 10px;
    }
    
    @media (max-width: 480px) {
        padding: 12px;
        font-size: 0.9rem;
        min-height: 80px;
        border-radius: 8px;
    }
`;

const FormGroup = styled.div`
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(15px);
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 18px;
    border: 1px solid rgba(255, 215, 0, 0.15);
    box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(255, 215, 0, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 215, 0, 0.25);
        box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.15),
            0 0 15px rgba(255, 215, 0, 0.2),
            inset 0 0 0 1px rgba(255, 215, 0, 0.2);
    }
    
    @media (max-width: 768px) {
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 15px;
    }
    
    @media (max-width: 480px) {
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 12px;
    }
`;

const Label = styled.label`
    color: #f5f5dc;
    display: block;
    margin-bottom: 8px;
    font-size: 1rem;
    font-weight: 500;
    text-shadow: 0 0 5px rgba(245, 245, 220, 0.3);
    
    @media (max-width: 768px) {
        font-size: 0.95rem;
        margin-bottom: 6px;
    }
    
    @media (max-width: 480px) {
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(255, 215, 0, 0.2);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    color: #f5f5dc;
    margin-bottom: 12px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 
        0 2px 10px rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(255, 215, 0, 0.1);
    position: relative;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: rgba(255, 215, 0, 0.5);
        box-shadow: 
            0 4px 15px rgba(0, 0, 0, 0.15),
            0 0 15px rgba(255, 215, 0, 0.3),
            inset 0 0 0 1px rgba(255, 215, 0, 0.3);
        background: rgba(255, 255, 255, 0.12);
        transform: scale(1.01);
    }

    &::placeholder {
        color: rgba(245, 245, 220, 0.6);
    }
    
    @media (max-width: 768px) {
        padding: 10px 14px;
        font-size: 0.95rem;
        border-radius: 8px;
        margin-bottom: 10px;
    }
    
    @media (max-width: 480px) {
        padding: 8px 12px;
        font-size: 0.9rem;
        border-radius: 6px;
        margin-bottom: 8px;
    }
`;

const ItemContainer = styled.div`
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(15px);
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 15px;
    border: 1px solid rgba(255, 215, 0, 0.15);
    box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.1),
        inset 0 0 0 1px rgba(255, 215, 0, 0.1);
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 215, 0, 0.25);
        box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.15),
            0 0 15px rgba(255, 215, 0, 0.2),
            inset 0 0 0 1px rgba(255, 215, 0, 0.2);
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 12px;
    }
    
    @media (max-width: 480px) {
        padding: 12px;
        border-radius: 10px;
        margin-bottom: 10px;
    }
`;

export function SectionEditor({sectionKey, value, onChange}) {
    const [loading, setLoading] = useState(false);
    const containerRef = useRef();
    const itemsRef = useRef([]);

    useEffect(() => {
        // Animate section container
        gsap.from(containerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out"
        });

        // Animate items if they exist
        if (Array.isArray(value) && itemsRef.current.length) {
            gsap.to(itemsRef.current, {
                x: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: "power3.out"
            });
        }
    }, [value]);

    const updateItem = (idx, key, val) => {
        const updated = Array.isArray(value) ? [...value] : [];
        if (key != null) {
            updated[idx] = { ...updated[idx], [key]: val };
        } else {
            updated[idx] = val;
        }
        onChange(updated);

        // Animate the updated item
        gsap.from(itemsRef.current[idx], {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const addEntry = () => {
        let newEntry;
        if (sectionKey === 'Experience') {
            newEntry = {
                company: '',
                role: '',
                duration: '',
                description: ''
            };
        } else if (sectionKey === 'Education') {
            newEntry = {
                institution: '',
                degree: '',
                year: '',
                gpa: ''
            };
        } else if (sectionKey === 'Skills') {
            newEntry = '';
        }

        const updated = Array.isArray(value) ? [...value, newEntry] : [newEntry];
        onChange(updated);

        // Animation for new entry
        setTimeout(() => {
            const newIndex = value.length; // Use current value length as the new index
            if (itemsRef.current[newIndex]) {
                gsap.from(itemsRef.current[newIndex], {
                    x: -20,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power3.out"
                });
            }
        }, 0);
    };

    const removeEntry = (idx) => {
        if (!Array.isArray(value)) return;
        
        // Animate removal
        gsap.to(itemsRef.current[idx], {
            x: 20,
            opacity: 0,
            duration: 0.3,
            ease: "power3.in",
            onComplete: () => {
                const updated = value.filter((_, i) => i !== idx);
                onChange(updated);
            }
        });
    };

    const enhance = async () => {
        setLoading(true);
        try {
            let contentToEnhance = '';
            if (typeof value === 'string') {
                contentToEnhance = value;
            } else if (Array.isArray(value)) {
                if (sectionKey === 'Skills') {
                    contentToEnhance = value.join(', ');
                } else {
                    contentToEnhance = JSON.stringify(value);
                }
            }

            const enhancedContent = await aiEnhance(sectionKey.toLowerCase(), contentToEnhance);
            
            let processedContent;
            if (typeof value === 'string') {
                processedContent = enhancedContent;
            } else if (Array.isArray(value)) {
                if (sectionKey === 'Skills') {
                    processedContent = enhancedContent.split(',').map(s => s.trim());
                } else {
                    try {
                        processedContent = JSON.parse(enhancedContent);
                    } catch {
                        processedContent = value;
                    }
                }
            }

            onChange(processedContent);
            
            // Animation for enhancement
            gsap.from(containerRef.current, {
                scale: 1.02,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        } catch (error) {
            console.error("Error enhancing section:", error);
        } finally {
            setLoading(false);
        }
    };

    if (Array.isArray(value)) {
        const isObjectList = sectionKey === 'Experience' || sectionKey === 'Education';

        return (
            <SectionContainer ref={containerRef} className="section-paper">
                <SectionTitle>{sectionKey}</SectionTitle>
                {value.map((item, idx) => (
                    <ItemContainer
                        key={idx}
                        ref={el => itemsRef.current[idx] = el}
                    >
                        {isObjectList ? (
                            <FormGroup>
                                {sectionKey === 'Experience' && (
                                    <>
                                        <Label>Company</Label>
                                        <Input
                                            value={item.company || ''}
                                            onChange={e => updateItem(idx, 'company', e.target.value)}
                                            placeholder="Company name"
                                        />
                                        <Label>Role</Label>
                                        <Input
                                            value={item.role || ''}
                                            onChange={e => updateItem(idx, 'role', e.target.value)}
                                            placeholder="Job title"
                                        />
                                        <Label>Duration</Label>
                                        <Input
                                            value={item.duration || ''}
                                            onChange={e => updateItem(idx, 'duration', e.target.value)}
                                            placeholder="Employment period"
                                        />
                                        <Label>Description</Label>
                                        <Input
                                            value={item.description || ''}
                                            onChange={e => updateItem(idx, 'description', e.target.value)}
                                            placeholder="Job description"
                                        />
                                    </>
                                )}
                                {sectionKey === 'Education' && (
                                    <>
                                        <Label>Institution</Label>
                                        <Input
                                            value={item.institution || ''}
                                            onChange={e => updateItem(idx, 'institution', e.target.value)}
                                            placeholder="School/University name"
                                        />
                                        <Label>Degree</Label>
                                        <Input
                                            value={item.degree || ''}
                                            onChange={e => updateItem(idx, 'degree', e.target.value)}
                                            placeholder="Degree/Certificate"
                                        />
                                        <Label>Year</Label>
                                        <Input
                                            value={item.year || ''}
                                            onChange={e => updateItem(idx, 'year', e.target.value)}
                                            placeholder="Graduation year"
                                        />
                                        <Label>GPA</Label>
                                        <Input
                                            value={item.gpa || ''}
                                            onChange={e => updateItem(idx, 'gpa', e.target.value)}
                                            placeholder="GPA (optional)"
                                        />
                                    </>
                                )}
                            </FormGroup>
                        ) : (
                            <Input
                                value={item}
                                onChange={e => updateItem(idx, null, e.target.value)}
                                placeholder="Enter skill"
                            />
                        )}
                        <Button onClick={() => removeEntry(idx)}>Remove</Button>
                    </ItemContainer>
                ))}
                <Button onClick={addEntry}>Add {isObjectList ? sectionKey.slice(0, -1) : 'Skill'}</Button>
                <Button onClick={enhance} disabled={loading}>
                    {loading ? "Enhancing..." : "Enhance with AI"}
                </Button>
            </SectionContainer>
        );
    }

    return (
        <SectionContainer ref={containerRef} className="section-paper">
            <SectionTitle>{sectionKey}</SectionTitle>
            <TextArea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Enter your ${sectionKey.toLowerCase()}...`}
            />
            <Button onClick={enhance} disabled={loading}>
                {loading ? "Enhancing..." : "Enhance with AI"}
            </Button>
        </SectionContainer>
    );
}