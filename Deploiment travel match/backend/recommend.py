import pandas as pd
import numpy as np
import os
import pickle
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from database import get_all_destinations

models_dir=os.path.join(os.path.dirname(__file__),"..","models")

alpha=0.6
beta=0.4 


embeddings=None
transformer=None
destination_cache=None

categories = ['culture', 'adventure', 'nature', 'beaches', 'nightlife', 
              'cuisine', 'wellness', 'urban', 'seclusion']

def load_models():
    global embeddings, transformer

    with open(os.path.join(models_dir, "embeddings.pkl"), "rb") as f:
        embeddings = pickle.load(f)
    with open(os.path.join(models_dir, "transformer.pkl"), "rb") as f:
        transformer = pickle.load(f)

def refresh_cache():
    global _category_matrix_cache, destination_cache

    destinations=get_all_destinations()
    destination_cache = pd.DataFrame(destinations)
    _category_matrix_cache = destination_cache[categories].values

    print(f"✅ Cache rafraîchi : {len(destination_cache)} destinations")


def recommend_hybrid(query, user_preferences,alpha=alpha,beta=beta,top=5):

    global _destinations_cache, _category_matrix_cache

    if _category_matrix_cache is None or destination_cache is None or embeddings is None or transformer is None:
        raise RuntimeError("Modèles ou cache non chargés — appelle load_models() et refresh_cache() au démarrage.")


    #charger la data 
    df=destination_cache.copy()

    #similarité du query avec les destinations
    query_embedding = transformer.encode([query])
    score_nlp = cosine_similarity(query_embedding, embeddings)[0]

    #similarité de categories avec les destinations

    #destination_category_matrix = df[categories].values remplacé par le cache pour eviter le recalcul
    user_vector = np.array([[user_preferences[cat] for cat in categories]])

    score_categories = cosine_similarity(user_vector,_category_matrix_cache)[0]


    #combiner les scores
    df['score_nlp'] = score_nlp
    df['score_categories'] = score_categories  
    df['score_final'] = alpha * score_nlp + beta * score_categories

    result=df.sort_values('score_final', ascending=False).head(top)
    return result[['city', 'country', 'short_description', 'score_nlp', 'score_categories', 'score_final']].to_dict(orient='records')   





