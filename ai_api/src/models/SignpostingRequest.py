from pydantic import BaseModel
from typing import List, Optional
class SignpostingOption(BaseModel):
    community_group: Optional[str]=None
    location_scope:str
    category_tags: List[str]
    description_short: str
    description_long: Optional[str]=None
    postcode: str
    area_covered: str
    external_url: str
    email: str
    name: str
    organizationName:str
class SignpostingRequest(BaseModel):
    options:List[SignpostingOption]
    language:str
    category:str


    