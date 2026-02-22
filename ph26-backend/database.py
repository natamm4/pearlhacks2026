                                                                                                                                                                                                          
from fastapi import FastAPI                                                                                                                                                                               
from sqlmodel import SQLModel, create_engine, Session                                                                                                                                                     
from contextlib import asynccontextmanager                                                                                                                                                                
from dotenv import load_dotenv                                                                                                                                                                            
import os                                                                                                                                                                                                 
                                                                                                                                                                                                        
# Import all models                                                                                                                                                                                       
                                                                                                                                   
                                                                                                                                                                                                        
load_dotenv()                                                                                                                                                                                             
                                                                                                                                                                                                        
DATABASE_URL = os.getenv("DATABASE_URL")                                                                                                                                                                  
if not DATABASE_URL:                                                                                                                                                                                      
    raise ValueError("DATABASE_URL not found in environment variables")                                                                                                                                   
                                                                                                                                                                                                        
engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=300,    # Recycle connections after 5 minutes
)                                                                                                                                                           
                                                                                                                                                                                                        
                                                                                                                                                                                                        
def create_db_and_tables():                                                                                                                                                                               
    SQLModel.metadata.create_all(engine)                                                                                                                                                                  
                                                                                                                                                                                                        
                                                                                                                                                                                                        
def get_session():                                                                                                                                                                                        
    with Session(engine) as session:                                                                                                                                                                      
        yield session 