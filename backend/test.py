from reelresume.client.tmdb import TMDBClient
client = TMDBClient()
print(client.get_person_image("Johnnie To"))