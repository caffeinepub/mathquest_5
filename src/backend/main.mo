import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Int "mo:core/Int";

actor {
  type ScoreEntry = {
    playerName : Text;
    ageGroup : Text;
    difficulty : Text;
    score : Nat;
    timestamp : Time.Time;
  };

  type ScoreId = Nat;

  module ScoreEntry {
    public func compare(entry1 : ScoreEntry, entry2 : ScoreEntry) : Order.Order {
      switch (Nat.compare(entry2.score, entry1.score)) {
        case (#equal) { Int.compare(entry2.timestamp, entry1.timestamp) };
        case (order) { order };
      };
    };
  };

  let scores = Map.empty<ScoreId, ScoreEntry>();
  var nextScoreId : ScoreId = 0;

  public type ScoreEntryInput = {
    playerName : Text;
    ageGroup : Text;
    difficulty : Text;
    score : Nat;
  };

  public shared ({ caller }) func submitScore(input : ScoreEntryInput) : async () {
    let score : ScoreEntry = {
      playerName = input.playerName;
      ageGroup = input.ageGroup;
      difficulty = input.difficulty;
      score = input.score;
      timestamp = Time.now();
    };

    scores.add(nextScoreId, score);
    nextScoreId += 1;
  };

  public query ({ caller }) func getTop10ByAgeGroup(ageGroup : Text) : async [ScoreEntry] {
    scores.values().toArray().filter(
      func(entry) { entry.ageGroup == ageGroup }
    ).sort().sliceToArray(0, 10);
  };

  public query ({ caller }) func getGlobalTop10() : async [ScoreEntry] {
    scores.values().toArray().sort().sliceToArray(0, 10);
  };
};
