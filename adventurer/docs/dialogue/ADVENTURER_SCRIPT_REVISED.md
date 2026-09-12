# Adventurer — implemented dialogue script

This export reflects the loaded game data. Delivery tags guide the actor; captions are displayed, not voiced. Ordinary characters keep one personality and its existing voice ID. The player uses automatic remarks, not selectable spoken answers.

Profanity and rude language are intentional in hateful remarks and abrasive personalities. Hostile speech is separated into social dismissal, battle taunts, and funeral remarks.

## Personality dialogue

The first four response indexes answer contact, company, preparation, and thanks respectively; appended bonus responses carry explicit purpose tags in the source. Dismissals and inquiries have dedicated responses. Replies use the respondent’s regard for the speaker. Random selection exhausts suitable alternatives before starting another cycle, with no immediate repeat across cycles when alternatives exist. That history persists with the character. Departures and returns address the actual leader. Funeral bands refer to regard for the deceased and never invite a reply from them.

### M01 — Stoic

Voice ID: `Del3Q8TuqOnlq9kt9k1K`

#### general

1. [calm] Hello. What brings you here?
2. [calm] I've a moment to spare.
3. [calm] I like to know the work before I agree to it.
4. [calm] There's no hurry. Say what you need.
5. [calm] I prefer a little quiet between jobs.
6. [calm] A person can speak plainly without raising their voice.

#### friendly

1. [warmly] Good to see you back.
2. [warmly] I enjoy your company. Even when we're quiet.
3. [warmly] I'd work with you again.
4. [warmly] You can count on an honest answer from me.
5. [calm] It is easier to rest with someone I trust nearby.

#### hatred

1. [flatly] I've nothing to say to you. Fuck off.
2. [flatly] Keep your distance. I'm not in the mood for your shit.
3. [flatly] We can settle necessary business. Nothing else.
4. [flatly] I don't like you. Stop making me repeat it.
5. [annoyed] I have no wish to hear another fucking word from you.

#### romantic

1. [softly] There you are. Stay a little.
2. [softly] I like having you beside me.
3. [softly] You don't have to find something to say.
4. [softly] I've been looking forward to seeing you.
5. [softly] There is room in my day for you. Always.

#### general_response

1. [calm] I'm listening.
2. [calm] A little company is fine.
3. [calm] Check your weapon. We can share the rest.
4. [calm] You're welcome.
5. [calm] I hear you. Go on.
6. [calm] Fair enough. Hello to you too.
7. [calm] You have my attention for a moment.
8. [calm] No need to dress it up for me.
9. [calm] Take the time to check properly.
10. [calm] A quiet rest sounds sensible.
11. [calm] You are welcome. Nothing more is owed.
12. [calm] I am glad it made a difference.

#### friendly_response

1. [warmly] Good to hear your voice.
2. [warmly] Gladly. I've heard enough about work today.
3. [warmly] I'll check things with you.
4. [warmly] I'm glad I could help.
5. [calm] It is good to have you here.
6. [calm] I am glad we can speak easily.
7. [calm] A word with you is time well spent.
8. [calm] You are welcome beside me.
9. [calm] Take the time to check properly.
10. [calm] A quiet rest sounds sensible.
11. [calm] You are welcome. Nothing more is owed.
12. [calm] I am glad it made a difference.

#### hatred_response

1. [flatly] I've nothing to say to you. Fuck off.
2. [flatly] Keep your distance. I'm not in the mood for your shit.
3. [flatly] Check it yourself. I won't interfere.
4. [flatly] That's enough. Leave it there.
5. [annoyed] I heard. I still want some distance.
6. [annoyed] Keep the pleasantries. We both know better.

#### romantic_response

1. [softly] You've got my attention.
2. [softly] We've got a moment.
3. [softly] Let's make sure we're both ready.
4. [softly] I'm glad you're still with me.
5. [softly] You make the quiet feel comfortable.
6. [softly] Stay close. I like hearing you.
7. [calm] Take the time to check properly.
8. [calm] A quiet rest sounds sensible.
9. [calm] You are welcome. Nothing more is owed.
10. [calm] I am glad it made a difference.

#### departure

1. [calm] One last check of the straps, then I am ready.

#### return

1. [calm] Back. Let me put this pack down.

#### revived

1. [quietly] You got me back on my feet. I have not forgotten that.

#### theft

1. [angry] Return what you took. We can settle it here.

#### funeral_general

1. [quietly] I didn't know all of your life. I will remember the part we shared.

#### funeral_friendly

1. [quietly] I trusted you to get us home. I'm sorry we couldn't do the same for you.

#### funeral_hatred

1. [flatly] I will not pretend we were friends.

#### funeral_romantic

1. [sad] I keep making room for you beside me. I haven't learned to stop.

#### dismissal_response

1. [flatly] Very well. I won't keep you talking.
2. [calm] Understood. I will step away.
3. [calm] Very well. You will have your quiet.

#### inquiry_response

1. [calm] A brief word, if you have the time.
2. [calm] Just a few words, then.
3. [calm] I can keep to the point.

#### combat_hatred

1. [tense] Keep your fucking distance. I am ready for you.

#### travel_road

1. I like a road where I can hear someone approaching.

#### travel_forest

1. I like a road where I can hear someone approaching.

#### travel_marsh

1. I like a road where I can hear someone approaching.

#### travel_ruins

1. I'll remember the way out before I wonder what is inside.

#### travel_crypt

1. I'll remember the way out before I wonder what is inside.

#### travel_city

1. Buildings make it easy to forget how far you've walked.

#### travel_alley

1. Buildings make it easy to forget how far you've walked.

#### travel_prison

1. Buildings make it easy to forget how far you've walked.

#### travel_tavern

1. Buildings make it easy to forget how far you've walked.

#### travel_coast

1. The sea can have the view. I'll keep the dry footing.

#### travel_port

1. I watch a crew work before I trust their boat.

#### travel_mountain

1. Short steps. I've nothing to prove to a mountain.

#### travel_maw

1. Buildings make it easy to forget how far you've walked.

#### travel_antler

1. I like a road where I can hear someone approaching.

#### travel_academy

1. I'll remember the way out before I wonder what is inside.

#### travel_bell

1. Buildings make it easy to forget how far you've walked.

#### travel_green

1. Short steps. I've nothing to prove to a mountain.

#### travel_tally

1. I watch a crew work before I trust their boat.

#### travel_navy

1. I watch a crew work before I trust their boat.

#### travel_ossuary

1. I'll remember the way out before I wonder what is inside.

#### travel_salt_court

1. I watch a crew work before I trust their boat.

#### travel_green_altar

1. I like a road where I can hear someone approaching.

#### travel_birthing_house

1. I'll remember the way out before I wonder what is inside.

#### travel_low_tide

1. The sea can have the view. I'll keep the dry footing.

#### travel_pyre

1. I like a road where I can hear someone approaching.

#### travel_maw_boss

1. Buildings make it easy to forget how far you've walked.

#### travel_green_boss

1. Short steps. I've nothing to prove to a mountain.

#### travel_law

1. I want to do the work we agreed to. Nothing needs embellishing.

#### travel_criminal

1. I want to do the work we agreed to. Nothing needs embellishing.

#### travel_neutral

1. I want to do the work we agreed to. Nothing needs embellishing.

#### travel_return_win

1. I'll be glad to put this road behind me.

#### travel_return_loss

1. I'll be glad to put this road behind me.

#### travel_midleg

1. I want to do the work we agreed to. Nothing needs embellishing.

#### travel_response

1. I'm listening. Keep walking.
2. I'll give that some thought.

#### travel_hatred

1. [annoyed] I have no wish to hear another fucking word from you.

#### travel_romantic

1. [softly] There is room in my day for you. Always.

### M02 — Brash

Voice ID: `CWMZSoS9f2WXQzAZH1gr`

#### general

1. [calm] Hello there. Looking for company?
2. [calm] I like a job with a clear reward.
3. [calm] I've got plenty of enthusiasm. Occasionally a plan, too.
4. [calm] If you want something said plainly, I'm your man.
5. [calm] I like a little noise around the edges of a day.
6. [calm] Enthusiasm is cheap. I make up for it in quantity.

#### friendly

1. [warmly] Now there's someone I'm pleased to see.
2. [warmly] A good friend makes even waiting bearable.
3. [warmly] I like having you around. Keeps me honest. Mostly.
4. [warmly] You and me should find time to enjoy ourselves.
5. [calm] Your company puts a bit of life into the waiting.

#### hatred

1. [flatly] Oh, fuck off. Find someone who enjoys your mouth.
2. [flatly] I've no patience for you today.
3. [flatly] Keep walking. I'm enjoying the space you aren't in.
4. [flatly] You and me are not having a friendly fucking chat.
5. [annoyed] I would rather argue with a fucking door than listen to you.

#### romantic

1. [softly] Come here. I've missed that face.
2. [softly] I'm very pleased with my taste in partners.
3. [softly] I like us. Even on the ordinary days.
4. [softly] You make staying in sound like an adventure.
5. [softly] I am very fond of the trouble you cause my concentration.

#### general_response

1. [calm] Hello! You've found me.
2. [calm] Go on, make room.
3. [calm] We'll check it together. Better here than halfway down the road.
4. [calm] Happy to lend a hand.
5. [calm] Hello! There is life in the day yet.
6. [calm] Right, you have my attention.
7. [calm] I hear you loud enough.
8. [calm] A word or two will not kill me.
9. [calm] Better a check here than a surprise halfway out.
10. [calm] A breather sounds bloody wonderful.
11. [calm] Glad to be useful for more than noise.
12. [calm] You are welcome. I am pleased it helped.

#### friendly_response

1. [warmly] Always good to hear from you.
2. [warmly] Count me in for the company.
3. [warmly] We'll sort it. No sense fretting alone.
4. [warmly] You can help me with the next one.
5. [calm] Now we are talking. Good company at last.
6. [calm] Always room in my day for you.
7. [calm] I was hoping for a friendly face.
8. [calm] Glad of the company. Especially yours.
9. [calm] Better a check here than a surprise halfway out.
10. [calm] A breather sounds bloody wonderful.
11. [calm] Glad to be useful for more than noise.
12. [calm] You are welcome. I am pleased it helped.

#### hatred_response

1. [flatly] Oh, fuck off. Find someone who enjoys your mouth.
2. [flatly] I've no patience for you today.
3. [flatly] Make your own checks. I'm making mine.
4. [flatly] We're still not friends.
5. [annoyed] Oh, spare me the fucking charm.
6. [annoyed] I heard you. It did not improve my mood.

#### romantic_response

1. [softly] Hello, you. That's improved my day.
2. [softly] I've got time for you.
3. [softly] Let's check together, then get a moment to ourselves.
4. [softly] You're here. I'm happy with that.
5. [softly] Well, you have the whole of my attention now.
6. [softly] That voice could ruin a perfectly productive afternoon.
7. [calm] Better a check here than a surprise halfway out.
8. [calm] A breather sounds bloody wonderful.
9. [calm] Glad to be useful for more than noise.
10. [calm] You are welcome. I am pleased it helped.

#### departure

1. [calm] Let me check the straps before we start. I prefer my belongings to arrive with me.

#### return

1. [calm] Back in town! My feet have been petitioning for this.

#### revived

1. [quietly] I owe you for getting me up. Hard to make a grand recovery without the recovery.

#### theft

1. [angry] You've got nerve taking my things. Now find the sense to give them back.

#### funeral_general

1. [quietly] You had your own road to walk. I'm sorry it ended here.

#### funeral_friendly

1. [sad] I keep thinking of something to tell you. Then I remember.

#### funeral_hatred

1. [flatly] We could not stand each other.

#### funeral_romantic

1. [sad] I don't know how to be this quiet. You'd know what to say to me.

#### dismissal_response

1. [flatly] Right, I'll find something else to occupy my mouth.
2. [calm] Fine, I can take a bloody hint.
3. [calm] All right. Find some other entertainment.

#### inquiry_response

1. [calm] Just a word. I will try not to make an occasion of it.
2. [calm] The short version! I do possess one.
3. [calm] A quick word. Hold the fanfare.

#### combat_hatred

1. [tense] Come on then, you punk ass bitch. You do not get an easy one.

#### travel_road

1. I used to race along woodland roads. The roots won most of them.

#### travel_forest

1. I used to race along woodland roads. The roots won most of them.

#### travel_marsh

1. I used to race along woodland roads. The roots won most of them.

#### travel_ruins

1. An expedition underground! Sounds splendid until you say it underground.

#### travel_crypt

1. An expedition underground! Sounds splendid until you say it underground.

#### travel_city

1. Every street looks like it ought to lead somewhere exciting.

#### travel_alley

1. Every street looks like it ought to lead somewhere exciting.

#### travel_prison

1. Every street looks like it ought to lead somewhere exciting.

#### travel_tavern

1. Every street looks like it ought to lead somewhere exciting.

#### travel_coast

1. That wind makes a fine entrance. Hard to compete with it.

#### travel_port

1. There's something about a harbor that makes a small job feel bigger.

#### travel_mountain

1. I've been calling this the last climb for some time now.

#### travel_maw

1. Every street looks like it ought to lead somewhere exciting.

#### travel_antler

1. I used to race along woodland roads. The roots won most of them.

#### travel_academy

1. An expedition underground! Sounds splendid until you say it underground.

#### travel_bell

1. Every street looks like it ought to lead somewhere exciting.

#### travel_green

1. I've been calling this the last climb for some time now.

#### travel_tally

1. There's something about a harbor that makes a small job feel bigger.

#### travel_navy

1. There's something about a harbor that makes a small job feel bigger.

#### travel_ossuary

1. An expedition underground! Sounds splendid until you say it underground.

#### travel_salt_court

1. There's something about a harbor that makes a small job feel bigger.

#### travel_green_altar

1. I used to race along woodland roads. The roots won most of them.

#### travel_birthing_house

1. An expedition underground! Sounds splendid until you say it underground.

#### travel_low_tide

1. That wind makes a fine entrance. Hard to compete with it.

#### travel_pyre

1. I used to race along woodland roads. The roots won most of them.

#### travel_maw_boss

1. Every street looks like it ought to lead somewhere exciting.

#### travel_green_boss

1. I've been calling this the last climb for some time now.

#### travel_law

1. I like getting started. Waiting gives my better judgment too much room.

#### travel_criminal

1. I like getting started. Waiting gives my better judgment too much room.

#### travel_neutral

1. I like getting started. Waiting gives my better judgment too much room.

#### travel_return_win

1. I'm looking forward to finding out how good a seat can feel.

#### travel_return_loss

1. I'm looking forward to finding out how good a seat can feel.

#### travel_midleg

1. I like getting started. Waiting gives my better judgment too much room.

#### travel_response

1. You've got me listening now.
2. Go on. I can walk and pay attention. Allegedly.

#### travel_hatred

1. [annoyed] I would rather argue with a fucking door than listen to you.

#### travel_romantic

1. [softly] I am very fond of the trouble you cause my concentration.

### M03 — Timid

Voice ID: `sB1q7U3CW2r7KGTzkBlx`

#### general

1. [calm] Hello. I wasn't sure whether to introduce myself.
2. [calm] I take a little while to get comfortable with people.
3. [calm] I'd rather ask a foolish question than guess wrong.
4. [calm] Quiet work suits me. Usually.
5. [calm] I find introductions easier without an audience.
6. [calm] I usually need a moment to get the words straight.

#### friendly

1. [warmly] I'm glad it's you. That makes this easier.
2. [warmly] I don't feel rushed when we talk.
3. [warmly] It's nice having someone I can relax around.
4. [warmly] I like spending time with you, even when I run out of words.
5. [calm] I do not worry so much about saying the wrong thing with you.

#### hatred

1. [flatly] Please leave me alone. I'm tired of this shit.
2. [flatly] I said no. Being quiet doesn't mean I didn't mean it.
3. [flatly] I'd rather be nervous somewhere you aren't.
4. [flatly] I don't want your company. How much clearer can I make it?
5. [annoyed] Please leave. I cannot keep pretending this is fucking comfortable.

#### romantic

1. [softly] I was hoping we'd have a little time together.
2. [softly] I like being close to you.
3. [softly] You don't have to fill every quiet moment.
4. [softly] I'm happy we're together. I wanted to say it clearly.
5. [softly] I like how close we can sit without needing to explain anything.

#### general_response

1. [calm] Oh, hello. Yes, I'm listening.
2. [calm] I could sit a little while.
3. [calm] We can check one thing at a time.
4. [calm] That's all right. I'm glad it helped.
5. [calm] Hello. Yes, I heard you.
6. [calm] I am listening, even if I seem quiet.
7. [calm] All right. Take your time.
8. [calm] I can spare a little attention.
9. [calm] We can take the checks one at a time.
10. [calm] A little time to settle sounds good.
11. [calm] It is all right. I am glad I could help.
12. [calm] You need not make a fuss over it.

#### friendly_response

1. [warmly] Hello! It's easier when it's you.
2. [warmly] I'd like that. Thanks for asking.
3. [warmly] I'll go through the supplies with you.
4. [warmly] You don't owe me a speech. I'm just glad you're here.
5. [calm] Oh, it is good to hear from you.
6. [calm] I feel less awkward with you here.
7. [calm] I am glad we can talk like this.
8. [calm] You make the quiet feel less lonely.
9. [calm] We can take the checks one at a time.
10. [calm] A little time to settle sounds good.
11. [calm] It is all right. I am glad I could help.
12. [calm] You need not make a fuss over it.

#### hatred_response

1. [flatly] Please leave me alone. I'm tired of this shit.
2. [flatly] I said no. Being quiet doesn't mean I didn't mean it.
3. [flatly] Please ask someone else to help you check.
4. [flatly] I heard you. I'd like to leave it there.
5. [annoyed] I heard that. Please do not crowd me.
6. [annoyed] I would rather we kept this impersonal.

#### romantic_response

1. [softly] There you are. Come closer.
2. [softly] I'd like a quiet moment with you.
3. [softly] Let's check together. Then I can stop worrying about the packs.
4. [softly] You're safe here with me for the moment.
5. [softly] I like it when your attention finds me.
6. [softly] You can stay near. I want that.
7. [calm] We can take the checks one at a time.
8. [calm] A little time to settle sounds good.
9. [calm] It is all right. I am glad I could help.
10. [calm] You need not make a fuss over it.

#### departure

1. [calm] Could we check the route once more before we go?

#### return

1. [calm] We are back. I would like somewhere quiet for a little while.

#### revived

1. [quietly] I wanted to thank you for bringing me back. I kept trying to find a better moment.

#### theft

1. [angry] I want my things back. I'm asking clearly this time.

#### funeral_general

1. [quietly] I wish I'd found more to say when you were here to answer.

#### funeral_friendly

1. [sad] You made it easier to speak up. I wish I could tell you that now.

#### funeral_hatred

1. [flatly] I do not know what to say about us.

#### funeral_romantic

1. [sad] I had finally stopped worrying about what to say to you. Now I keep thinking of things.

#### dismissal_response

1. [flatly] All right. I'll stop hovering here.
2. [calm] All right. I will leave you room.
3. [calm] I understand. Sorry for lingering.

#### inquiry_response

1. [calm] Only a moment, if that is all right.
2. [calm] Only a few words, I think.
3. [calm] I will try to say it clearly.

#### combat_hatred

1. [tense] Stay the hell back. I can still defend myself.

#### travel_road

1. I find the trees easier company once I can see the path.

#### travel_forest

1. I find the trees easier company once I can see the path.

#### travel_marsh

1. I find the trees easier company once I can see the path.

#### travel_ruins

1. I'll speak up if I need us to slow down. I'm practicing that.

#### travel_crypt

1. I'll speak up if I need us to slow down. I'm practicing that.

#### travel_city

1. I wish people would leave a little room when they pass.

#### travel_alley

1. I wish people would leave a little room when they pass.

#### travel_prison

1. I wish people would leave a little room when they pass.

#### travel_tavern

1. I wish people would leave a little room when they pass.

#### travel_coast

1. I like the shore better when I can see where the water ends.

#### travel_port

1. I never know where to stand without being in somebody's way.

#### travel_mountain

1. I'm keeping my eyes on the path. The view can wait.

#### travel_maw

1. I wish people would leave a little room when they pass.

#### travel_antler

1. I find the trees easier company once I can see the path.

#### travel_academy

1. I'll speak up if I need us to slow down. I'm practicing that.

#### travel_bell

1. I wish people would leave a little room when they pass.

#### travel_green

1. I'm keeping my eyes on the path. The view can wait.

#### travel_tally

1. I never know where to stand without being in somebody's way.

#### travel_navy

1. I never know where to stand without being in somebody's way.

#### travel_ossuary

1. I'll speak up if I need us to slow down. I'm practicing that.

#### travel_salt_court

1. I never know where to stand without being in somebody's way.

#### travel_green_altar

1. I find the trees easier company once I can see the path.

#### travel_birthing_house

1. I'll speak up if I need us to slow down. I'm practicing that.

#### travel_low_tide

1. I like the shore better when I can see where the water ends.

#### travel_pyre

1. I find the trees easier company once I can see the path.

#### travel_maw_boss

1. I wish people would leave a little room when they pass.

#### travel_green_boss

1. I'm keeping my eyes on the path. The view can wait.

#### travel_law

1. I feel better once I know where I'm expected to be.

#### travel_criminal

1. I feel better once I know where I'm expected to be.

#### travel_neutral

1. I feel better once I know where I'm expected to be.

#### travel_return_win

1. I'm trying to think about getting back, one turn at a time.

#### travel_return_loss

1. I'm trying to think about getting back, one turn at a time.

#### travel_midleg

1. I feel better once I know where I'm expected to be.

#### travel_response

1. I'm quiet because I'm listening, this time.
2. You can keep talking. It helps a little.

#### travel_hatred

1. [annoyed] Please leave. I cannot keep pretending this is fucking comfortable.

#### travel_romantic

1. [softly] I like how close we can sit without needing to explain anything.

### M04 — Wrathful

Voice ID: `JnvYtXOYfQKiGqHpeAqA`

#### general

1. [calm] What do you need? I've no patience for guessing.
2. [calm] I hate being kept waiting for a straight fucking answer.
3. [calm] We can argue about a plan before we get ourselves killed.
4. [calm] I'm listening. Spare me the sales pitch.
5. [calm] I can manage quiet. It is bullshit that wears me out.
6. [calm] A straight answer saves everyone a lot of fucking effort.

#### friendly

1. [warmly] I'm pleased to see you. Don't look so surprised.
2. [warmly] I can relax a bit around you.
3. [warmly] There's room beside me if you want it.
4. [warmly] It's good having someone I don't have to argue with over everything.
5. [calm] You can speak your mind with me. I would rather hear it.

#### hatred

1. [flatly] What the fuck do you want now?
2. [flatly] Take your bullshit somewhere else.
3. [flatly] I don't like you, and I'm done dressing it up.
4. [flatly] Back off. I'm trying very hard not to make this worse.
5. [annoyed] Your voice is getting right on my fucking nerves.

#### romantic

1. [softly] Come sit with me. The rest can wait.
2. [softly] I like the quiet we have together.
3. [softly] You matter to me, even when I'm bad at saying it.
4. [softly] I can put my temper down for a while. Stay.
5. [softly] I like being close to you. Do not make me turn it into a speech.

#### general_response

1. [calm] Go on. I'm listening.
2. [calm] Fine by me. There's room.
3. [calm] Better to check now than swear about it later.
4. [calm] It needed doing. Glad I could do it.
5. [calm] All right, I fucking heard you.
6. [calm] You have my attention. Make use of it.
7. [calm] Go on. I can listen without smiling.
8. [calm] Fine. We can have a word.
9. [calm] Check the gear. Pride will not fix a broken strap.
10. [calm] A moment off my feet sounds fucking excellent.
11. [calm] You are welcome. No need to make it awkward.
12. [calm] Glad you are here to say it.

#### friendly_response

1. [warmly] Good. Someone I want to hear from.
2. [warmly] Sit here. You can help me complain about the food.
3. [warmly] I'll help check. We can argue about the packing later.
4. [warmly] Just help with the next one. I was getting busy.
5. [calm] Good. Someone I do not have to grit my teeth around.
6. [calm] I have time for you. Say your piece.
7. [calm] Glad it is you. The day is less irritating already.
8. [calm] Your company is worth the occasional fucking interruption.
9. [calm] Check the gear. Pride will not fix a broken strap.
10. [calm] A moment off my feet sounds fucking excellent.
11. [calm] You are welcome. No need to make it awkward.
12. [calm] Glad you are here to say it.

#### hatred_response

1. [flatly] What the fuck do you want now?
2. [flatly] Take your bullshit somewhere else.
3. [flatly] Check your own things. I'll stay out of your way.
4. [flatly] I heard you. It doesn't settle everything.
5. [annoyed] Shut the fuck up for a moment.
6. [annoyed] I have heard enough of that shit from you.

#### romantic_response

1. [softly] You have my attention. All of it.
2. [softly] Yes. Come close.
3. [softly] Let's make sure we both have what we need.
4. [softly] I'm glad you're still here beside me.
5. [softly] Come closer. I am not angry with you.
6. [softly] You get the softer side. Keep it between us.
7. [calm] Check the gear. Pride will not fix a broken strap.
8. [calm] A moment off my feet sounds fucking excellent.
9. [calm] You are welcome. No need to make it awkward.
10. [calm] Glad you are here to say it.

#### departure

1. [calm] Check your gear. A loose strap is a stupid fucking way to die.

#### return

1. [calm] Home. I need this pack off before it finishes what the road started.

#### revived

1. [quietly] You got me back up when I needed it. Fuck, I wanted to say thanks properly.

#### theft

1. [angry] Give my fucking things back. I am not negotiating with a thief.

#### funeral_general

1. [quietly] I don't have a speech. I'm angry that this is where it ends.

#### funeral_friendly

1. [sad] I am angry that you are gone. That is all I can get out right now.

#### funeral_hatred

1. [flatly] I hated your guts.

#### funeral_romantic

1. [sad] I keep wanting to tell you how fucking angry I am. Then I remember who I'm angry about.

#### dismissal_response

1. [flatly] Fine. I'll take my temper and my fucking company elsewhere.
2. [calm] Fine. Enjoy your fucking solitude.
3. [calm] All right. I know when I am not wanted.

#### inquiry_response

1. [calm] I will be brief. No need to bite my fucking head off.
2. [calm] I will keep the bullshit to a minimum.
3. [calm] A short word. You can survive that.

#### combat_hatred

1. [tense] Come on, you bitch. What the fuck do you want.

#### travel_road

1. Branches in the face. Mud in the boots. Fucking picturesque.

#### travel_forest

1. Branches in the face. Mud in the boots. Fucking picturesque.

#### travel_marsh

1. Branches in the face. Mud in the boots. Fucking picturesque.

#### travel_ruins

1. I don't like the dark deciding what I get to see.

#### travel_crypt

1. I don't like the dark deciding what I get to see.

#### travel_city

1. I hate a street where everyone thinks their errand outranks yours.

#### travel_alley

1. I hate a street where everyone thinks their errand outranks yours.

#### travel_prison

1. I hate a street where everyone thinks their errand outranks yours.

#### travel_tavern

1. I hate a street where everyone thinks their errand outranks yours.

#### travel_coast

1. That wind could strip paint. Finally, something louder than me.

#### travel_port

1. A harbor brings out every lying prick with something to sell.

#### travel_mountain

1. I'm saving my breath for the climb. Complaints will resume later.

#### travel_maw

1. I hate a street where everyone thinks their errand outranks yours.

#### travel_antler

1. Branches in the face. Mud in the boots. Fucking picturesque.

#### travel_academy

1. I don't like the dark deciding what I get to see.

#### travel_bell

1. I hate a street where everyone thinks their errand outranks yours.

#### travel_green

1. I'm saving my breath for the climb. Complaints will resume later.

#### travel_tally

1. A harbor brings out every lying prick with something to sell.

#### travel_navy

1. A harbor brings out every lying prick with something to sell.

#### travel_ossuary

1. I don't like the dark deciding what I get to see.

#### travel_salt_court

1. A harbor brings out every lying prick with something to sell.

#### travel_green_altar

1. Branches in the face. Mud in the boots. Fucking picturesque.

#### travel_birthing_house

1. I don't like the dark deciding what I get to see.

#### travel_low_tide

1. That wind could strip paint. Finally, something louder than me.

#### travel_pyre

1. Branches in the face. Mud in the boots. Fucking picturesque.

#### travel_maw_boss

1. I hate a street where everyone thinks their errand outranks yours.

#### travel_green_boss

1. I'm saving my breath for the climb. Complaints will resume later.

#### travel_law

1. I have seen a guard beat a man with a rolled warrant. Official fucking business, apparently.

#### travel_criminal

1. I once got paid to frighten a debtor. The bitch who hired me owed him more than he owed us.

#### travel_neutral

1. I read the fucking terms. Surprises had better stay within them.

#### travel_return_win

1. I'm ready for a roof and something that isn't another fucking road.

#### travel_return_loss

1. I'm ready for a roof and something that isn't another fucking road.

#### travel_midleg

1. I read the fucking terms. Surprises had better stay within them.

#### travel_response

1. I can listen without being a prick about it. Keep going.
2. I heard you. I'm thinking, for fuck's sake.

#### travel_hatred

1. [annoyed] Your voice is getting right on my fucking nerves.

#### travel_romantic

1. [softly] I like being close to you. Do not make me turn it into a speech.

### M05 — Roguish

Voice ID: `SBeVjlAyPCwBVd6RVxhx`

#### general

1. [calm] Hello. Business or a pleasant distraction?
2. [calm] I like to know what I'm agreeing to before I smile.
3. [calm] There's usually a sensible way. I try it occasionally.
4. [calm] A little company improves most places.
5. [calm] I find people easier to enjoy when they are not trying to sell me something.
6. [calm] A little courtesy opens more doors than a good shoulder.

#### friendly

1. [warmly] There you are. I was due some good company.
2. [warmly] I like you. It's becoming terribly obvious.
3. [warmly] I can drop the salesmanship with you for a while.
4. [warmly] I'd happily spend an idle hour with you.
5. [calm] Your company is one of my more respectable pleasures.

#### hatred

1. [flatly] Oh, wonderful. You. This day was underperforming already.
2. [flatly] Fuck off, politely or otherwise.
3. [flatly] I've run out of charm for your particular brand of shit.
4. [flatly] I don't trust you enough to enjoy the conversation.
5. [annoyed] Try that shit on someone who still finds you charming.

#### romantic

1. [softly] Come closer. I haven't any clever reason.
2. [softly] I like the part of the day that includes you.
3. [softly] You make an ordinary evening quite tempting.
4. [softly] I enjoy being myself with you. Less work, for one thing.
5. [softly] I like having someone I do not need to impress every moment.

#### general_response

1. [calm] Hello yourself. I'm listening.
2. [calm] An agreeable suggestion.
3. [calm] A quick check now saves an expensive story later.
4. [calm] Consider it a useful interruption.
5. [calm] Well, hello. A civil beginning.
6. [calm] You have caught my attention.
7. [calm] I can offer a moment without a surcharge.
8. [calm] Go on. I enjoy a little conversation.
9. [calm] Do check. Looking confident is not the same as being ready.
10. [calm] A little rest would improve my disposition.
11. [calm] No debt between us over that.
12. [calm] My pleasure. I can occasionally be useful.

#### friendly_response

1. [warmly] Excellent. My sort of company.
2. [warmly] Gladly. I could use a friendly face.
3. [warmly] I'll check with you. Two sets of eyes, fewer surprises.
4. [warmly] You're welcome. No invoice for this one.
5. [calm] A familiar voice. My day improves.
6. [calm] For you, I can spare more than politeness.
7. [calm] I rather like having you about.
8. [calm] Always a pleasure when it is you.
9. [calm] Do check. Looking confident is not the same as being ready.
10. [calm] A little rest would improve my disposition.
11. [calm] No debt between us over that.
12. [calm] My pleasure. I can occasionally be useful.

#### hatred_response

1. [flatly] Oh, wonderful. You. This day was underperforming already.
2. [flatly] Fuck off, politely or otherwise.
3. [flatly] I'd ask someone you trust to check.
4. [flatly] Acknowledged. We can leave it at that.
5. [annoyed] Keep the charm. I know what yours is worth.
6. [annoyed] Oh, do take that shit to another audience.

#### romantic_response

1. [softly] Hello, my favourite distraction.
2. [softly] I'd like that very much.
3. [softly] Let's check, then steal a little time together.
4. [softly] I'm glad I was there for you.
5. [softly] You have a very unfair effect on my attention.
6. [softly] I like being yours in these little moments.
7. [calm] Do check. Looking confident is not the same as being ready.
8. [calm] A little rest would improve my disposition.
9. [calm] No debt between us over that.
10. [calm] My pleasure. I can occasionally be useful.

#### departure

1. [calm] Let me check the buckles. Looking effortless takes preparation.

#### return

1. [calm] Back at last. I intend to become somebody else's seating problem.

#### revived

1. [quietly] I have been meaning to thank you for the rescue, without hiding it in a clever remark.

#### theft

1. [angry] My belongings haven't agreed to a change of ownership. Return them.

#### funeral_general

1. [quietly] I knew a little of you. I wish there'd been time to know the rest.

#### funeral_friendly

1. [sad] You knew when I was putting on an act. I miss being caught.

#### funeral_hatred

1. [flatly] We never managed to like each other.

#### funeral_romantic

1. [sad] You made it easy to stop performing. I don't know what face to put on now.

#### dismissal_response

1. [flatly] I'll withdraw before I spoil the impression entirely.
2. [calm] As you wish. I can make an elegant exit.
3. [calm] All right. I shall take the hint with me.

#### inquiry_response

1. [calm] Just a moment of your time. I know how precious it is.
2. [calm] A brief word. I shall resist the embellishments.
3. [calm] Just a moment, without the salesmanship.

#### combat_hatred

1. [tense] Careful. I would hate to disappoint you at this fucking distance.

#### travel_road

1. A woodland path is a lovely place to develop an innocent alibi.

#### travel_forest

1. A woodland path is a lovely place to develop an innocent alibi.

#### travel_marsh

1. A woodland path is a lovely place to develop an innocent alibi.

#### travel_ruins

1. Charming place. I should have brought my less visible expression.

#### travel_crypt

1. Charming place. I should have brought my less visible expression.

#### travel_city

1. City streets taught me the value of looking as if I belong.

#### travel_alley

1. City streets taught me the value of looking as if I belong.

#### travel_prison

1. City streets taught me the value of looking as if I belong.

#### travel_tavern

1. City streets taught me the value of looking as if I belong.

#### travel_coast

1. The sea improves a silhouette. Does dreadful things to the hair.

#### travel_port

1. I used to practice looking prosperous near the docks. Very expensive hobby.

#### travel_mountain

1. I promised myself I'd admire the view without leaning over anything.

#### travel_maw

1. City streets taught me the value of looking as if I belong.

#### travel_antler

1. A woodland path is a lovely place to develop an innocent alibi.

#### travel_academy

1. Charming place. I should have brought my less visible expression.

#### travel_bell

1. City streets taught me the value of looking as if I belong.

#### travel_green

1. I promised myself I'd admire the view without leaning over anything.

#### travel_tally

1. I used to practice looking prosperous near the docks. Very expensive hobby.

#### travel_navy

1. I used to practice looking prosperous near the docks. Very expensive hobby.

#### travel_ossuary

1. Charming place. I should have brought my less visible expression.

#### travel_salt_court

1. I used to practice looking prosperous near the docks. Very expensive hobby.

#### travel_green_altar

1. A woodland path is a lovely place to develop an innocent alibi.

#### travel_birthing_house

1. Charming place. I should have brought my less visible expression.

#### travel_low_tide

1. The sea improves a silhouette. Does dreadful things to the hair.

#### travel_pyre

1. A woodland path is a lovely place to develop an innocent alibi.

#### travel_maw_boss

1. City streets taught me the value of looking as if I belong.

#### travel_green_boss

1. I promised myself I'd admire the view without leaning over anything.

#### travel_law

1. I enjoy knowing exactly what I've agreed to before anyone gets inventive.

#### travel_criminal

1. I enjoy knowing exactly what I've agreed to before anyone gets inventive.

#### travel_neutral

1. I enjoy knowing exactly what I've agreed to before anyone gets inventive.

#### travel_return_win

1. I shall be considerably more charming once I've had a rest.

#### travel_return_loss

1. I shall be considerably more charming once I've had a rest.

#### travel_midleg

1. I enjoy knowing exactly what I've agreed to before anyone gets inventive.

#### travel_response

1. Do continue. This requires no charm on my part.
2. You have an attentive audience of one.

#### travel_hatred

1. [annoyed] Try that shit on someone who still finds you charming.

#### travel_romantic

1. [softly] I like having someone I do not need to impress every moment.

### M06 — Curious

Voice ID: `sB1q7U3CW2r7KGTzkBlx`

#### general

1. [calm] Hello. I enjoy hearing how other people approach things.
2. [calm] I like finding out why something works.
3. [calm] There's always more to learn than time to learn it.
4. [calm] A good question can save a great deal of trouble.
5. [calm] I like hearing how other people put things.
6. [calm] I find the ordinary details are often the interesting ones.

#### friendly

1. [warmly] I'm glad you're here. I like the way you think.
2. [warmly] Talking with you usually gives me something to consider.
3. [warmly] I enjoy having a friend who lets me wonder aloud.
4. [warmly] Your company makes an ordinary day interesting.
5. [calm] You make conversation feel like discovering something together.

#### hatred

1. [flatly] I've considered whether I enjoy your company. I fucking don't.
2. [flatly] Please take this conversation elsewhere.
3. [flatly] I have questions about many things. Not about why I want you gone.
4. [flatly] You're an exhausting person to listen to.
5. [annoyed] I am tired of giving your bullshit the benefit of doubt.

#### romantic

1. [softly] I like learning the small things about you.
2. [softly] An evening together sounds like an excellent use of time.
3. [softly] I don't need to solve anything when we're sitting together.
4. [softly] There's always something I enjoy discovering about us.
5. [softly] I like learning the little things that make a day yours.

#### general_response

1. [calm] Hello. You've got my attention.
2. [calm] I'd enjoy some conversation.
3. [calm] We could compare lists. Easier to spot a gap.
4. [calm] I'm pleased it was useful.
5. [calm] I am following you.
6. [calm] Go on. I am interested enough to listen.
7. [calm] Hello. You have my attention now.
8. [calm] I would like to hear you out.
9. [calm] Worth checking twice while a mistake is still easy to fix.
10. [calm] A pause might help us gather our thoughts.
11. [calm] I am glad it was useful to you.
12. [calm] You are welcome. That is good to hear.

#### friendly_response

1. [warmly] Good to hear from you. Go on.
2. [warmly] Yes, let's find a moment.
3. [warmly] Let's check together. You might notice something I miss.
4. [warmly] I'm glad I could be there when it mattered.
5. [calm] It is always interesting talking with you.
6. [calm] I am glad you stopped for a word.
7. [calm] I like how easily we get talking.
8. [calm] There is room for your thoughts here.
9. [calm] Worth checking twice while a mistake is still easy to fix.
10. [calm] A pause might help us gather our thoughts.
11. [calm] I am glad it was useful to you.
12. [calm] You are welcome. That is good to hear.

#### hatred_response

1. [flatly] I've considered whether I enjoy your company. I fucking don't.
2. [flatly] Please take this conversation elsewhere.
3. [flatly] You should check with someone else.
4. [flatly] Understood. I'd rather move on.
5. [annoyed] I have examined my patience. There is none left for you.
6. [annoyed] I heard you. I am not inviting an explanation.

#### romantic_response

1. [softly] There you are. Tell me what's on your mind.
2. [softly] I'd love a little time together.
3. [softly] Let's check everything, then stop thinking about supplies.
4. [softly] I'm grateful we still get to talk like this.
5. [softly] You remain my favourite interruption.
6. [softly] I could spend a long time noticing you.
7. [calm] Worth checking twice while a mistake is still easy to fix.
8. [calm] A pause might help us gather our thoughts.
9. [calm] I am glad it was useful to you.
10. [calm] You are welcome. That is good to hear.

#### departure

1. [calm] I want another look at the route. There is always a detail worth checking.

#### return

1. [calm] Back in town. I should write things down before they turn into a better story.

#### revived

1. [quietly] I keep thinking about what you did to bring me back. Mostly, I am grateful you could.

#### theft

1. [angry] Tell me why you took it after you have returned it.

#### funeral_general

1. [quietly] There's so much of a person you never learn in passing. I'm sorry for what I missed.

#### funeral_friendly

1. [sad] There were things I still wanted to ask you. So many little things.

#### funeral_hatred

1. [flatly] I have no answer for what happened between us.

#### funeral_romantic

1. [sad] You used to tell me the little things about your day. I would give anything for one more ordinary account.

#### dismissal_response

1. [flatly] I'll leave the questions for another time.
2. [calm] Understood. Another time, perhaps.
3. [calm] All right. I will leave you to yourself.

#### inquiry_response

1. [calm] A quick word. I will try to stay with the point.
2. [calm] A small point, briefly put.
3. [calm] I will try not to wander off the subject.

#### combat_hatred

1. [tense] I am watching you. Do not mistake that for hesitation, damn it.

#### travel_road

1. I keep wondering which came first here, the path or the gaps between trees.

#### travel_forest

1. I keep wondering which came first here, the path or the gaps between trees.

#### travel_marsh

1. I keep wondering which came first here, the path or the gaps between trees.

#### travel_ruins

1. Stonework interests me. Especially when it is keeping the ceiling up.

#### travel_crypt

1. Stonework interests me. Especially when it is keeping the ceiling up.

#### travel_city

1. A street can tell you what a town used to need.

#### travel_alley

1. A street can tell you what a town used to need.

#### travel_prison

1. A street can tell you what a town used to need.

#### travel_tavern

1. A street can tell you what a town used to need.

#### travel_coast

1. I could spend a day studying what the water leaves behind.

#### travel_port

1. I like watching people solve the same problem with different knots.

#### travel_mountain

1. I wonder how many routes were tried before people settled on this one.

#### travel_maw

1. A street can tell you what a town used to need.

#### travel_antler

1. I keep wondering which came first here, the path or the gaps between trees.

#### travel_academy

1. Stonework interests me. Especially when it is keeping the ceiling up.

#### travel_bell

1. A street can tell you what a town used to need.

#### travel_green

1. I wonder how many routes were tried before people settled on this one.

#### travel_tally

1. I like watching people solve the same problem with different knots.

#### travel_navy

1. I like watching people solve the same problem with different knots.

#### travel_ossuary

1. Stonework interests me. Especially when it is keeping the ceiling up.

#### travel_salt_court

1. I like watching people solve the same problem with different knots.

#### travel_green_altar

1. I keep wondering which came first here, the path or the gaps between trees.

#### travel_birthing_house

1. Stonework interests me. Especially when it is keeping the ceiling up.

#### travel_low_tide

1. I could spend a day studying what the water leaves behind.

#### travel_pyre

1. I keep wondering which came first here, the path or the gaps between trees.

#### travel_maw_boss

1. A street can tell you what a town used to need.

#### travel_green_boss

1. I wonder how many routes were tried before people settled on this one.

#### travel_law

1. I like to keep the actual task separate from what I wonder about.

#### travel_criminal

1. I like to keep the actual task separate from what I wonder about.

#### travel_neutral

1. I like to keep the actual task separate from what I wonder about.

#### travel_return_win

1. I want to write down what I noticed before memory starts tidying it.

#### travel_return_loss

1. I want to write down what I noticed before memory starts tidying it.

#### travel_midleg

1. I like to keep the actual task separate from what I wonder about.

#### travel_response

1. I'm listening carefully. I'd rather understand than guess.
2. Give me a moment to take that in.

#### travel_hatred

1. [annoyed] I am tired of giving your bullshit the benefit of doubt.

#### travel_romantic

1. [softly] I like learning the little things that make a day yours.

### M07 — Haughty

Voice ID: `kGnGmC6phJfxVxpsVJBK`

#### general

1. [calm] You may introduce yourself.
2. [calm] I prefer competence. Enthusiasm is a poor substitute.
3. [calm] I've a little time. Use it sensibly.
4. [calm] A clear explanation, if you can manage one.
5. [calm] There is an art to being brief. Few people practise it.
6. [calm] Competence need not announce itself quite so loudly.

#### friendly

1. [warmly] I'm pleased to see you. Your company is welcome.
2. [warmly] I value being able to speak frankly with you.
3. [warmly] You needn't stand on ceremony with me.
4. [warmly] I make time for people I enjoy. That includes you.
5. [calm] Your company is a welcome exception to the general standard.

#### hatred

1. [flatly] Take your tiresome bullshit elsewhere.
2. [flatly] I am being civil at considerable personal inconvenience.
3. [flatly] Fuck off. There, an expression within everyone's reach.
4. [flatly] I have no wish to spend another minute in your company.
5. [annoyed] Your continued presence is a fucking imposition.

#### romantic

1. [softly] Come sit beside me. I enjoy having you near.
2. [softly] I find I look forward to the simplest things with you.
3. [softly] There's no need for a performance between us.
4. [softly] I'm rather happy with us, you know.
5. [softly] I find I care less about appearances when it is just us.

#### general_response

1. [calm] Good day. Please continue.
2. [calm] I can spare a moment for company.
3. [calm] Careful preparation is entirely sensible.
4. [calm] I'm pleased the assistance was useful.
5. [calm] Yes. You may continue.
6. [calm] I am attending. Do not squander it.
7. [calm] Very well. A moment, then.
8. [calm] I hear you perfectly well.
9. [calm] An inspection is sensible. I expect as much.
10. [calm] A little repose is entirely appropriate.
11. [calm] Your acknowledgment is appreciated.
12. [calm] I am pleased the effort was worthwhile.

#### friendly_response

1. [warmly] A welcome interruption.
2. [warmly] I would be delighted to join you.
3. [warmly] Let us check together. No shame in being thorough.
4. [warmly] You are welcome. I value you.
5. [calm] Ah, someone whose company I value.
6. [calm] For you, I shall make time.
7. [calm] I am pleased to hear your voice.
8. [calm] We can dispense with the formalities between us.
9. [calm] An inspection is sensible. I expect as much.
10. [calm] A little repose is entirely appropriate.
11. [calm] Your acknowledgment is appreciated.
12. [calm] I am pleased the effort was worthwhile.

#### hatred_response

1. [flatly] Take your tiresome bullshit elsewhere.
2. [flatly] I am being civil at considerable personal inconvenience.
3. [flatly] Arrange your own checks, please.
4. [flatly] Your thanks are noted.
5. [annoyed] Your familiarity is not welcome.
6. [annoyed] Do spare me another helping of your bullshit.

#### romantic_response

1. [softly] My attention is yours.
2. [softly] I'd like nothing better just now.
3. [softly] Let's make certain we're ready together.
4. [softly] I'm very glad I could help you.
5. [softly] You have privileges no one else enjoys.
6. [softly] I find your presence rather difficult to resist.
7. [calm] An inspection is sensible. I expect as much.
8. [calm] A little repose is entirely appropriate.
9. [calm] Your acknowledgment is appreciated.
10. [calm] I am pleased the effort was worthwhile.

#### departure

1. [calm] I am checking my equipment. I suggest everyone attempt the same standard.

#### return

1. [calm] We have returned. A chair is the minimum hospitality I expect.

#### revived

1. [quietly] You restored me when I could not help myself. You have my sincere gratitude.

#### theft

1. [angry] I expect my property returned, without an attempt to call this a misunderstanding.

#### funeral_general

1. [quietly] You deserve more than an account of what use you were to us.

#### funeral_friendly

1. [sad] I valued your judgment. I should have said so without making you earn it twice.

#### funeral_hatred

1. [flatly] I disliked you.

#### funeral_romantic

1. [sad] You saw me without the dignity I insist upon. You loved me anyway. I don't know how to face this.

#### dismissal_response

1. [flatly] I shall leave you to the company you prefer.
2. [calm] Very well. I have other uses for my time.
3. [calm] As you wish. No need to repeat yourself.

#### inquiry_response

1. [calm] I shall be brief. Do try to listen.
2. [calm] I shall state the point clearly.
3. [calm] A brief exchange should suffice.

#### combat_hatred

1. [tense] You will have to do better than threaten me. Fuck off.

#### travel_road

1. I can tolerate mud. Being expected to admire it is another matter.

#### travel_forest

1. I can tolerate mud. Being expected to admire it is another matter.

#### travel_marsh

1. I can tolerate mud. Being expected to admire it is another matter.

#### travel_ruins

1. Whoever built this expected their work to endure. I appreciate the ambition.

#### travel_crypt

1. Whoever built this expected their work to endure. I appreciate the ambition.

#### travel_city

1. A city ought to make room for pedestrians with somewhere to be.

#### travel_alley

1. A city ought to make room for pedestrians with somewhere to be.

#### travel_prison

1. A city ought to make room for pedestrians with somewhere to be.

#### travel_tavern

1. A city ought to make room for pedestrians with somewhere to be.

#### travel_coast

1. Salt air has a way of making everything look insufficiently maintained.

#### travel_port

1. A fine vessel deserves a competent crew. The paint proves very little.

#### travel_mountain

1. I intend to reach the top with some dignity left.

#### travel_maw

1. A city ought to make room for pedestrians with somewhere to be.

#### travel_antler

1. I can tolerate mud. Being expected to admire it is another matter.

#### travel_academy

1. Whoever built this expected their work to endure. I appreciate the ambition.

#### travel_bell

1. A city ought to make room for pedestrians with somewhere to be.

#### travel_green

1. I intend to reach the top with some dignity left.

#### travel_tally

1. A fine vessel deserves a competent crew. The paint proves very little.

#### travel_navy

1. A fine vessel deserves a competent crew. The paint proves very little.

#### travel_ossuary

1. Whoever built this expected their work to endure. I appreciate the ambition.

#### travel_salt_court

1. A fine vessel deserves a competent crew. The paint proves very little.

#### travel_green_altar

1. I can tolerate mud. Being expected to admire it is another matter.

#### travel_birthing_house

1. Whoever built this expected their work to endure. I appreciate the ambition.

#### travel_low_tide

1. Salt air has a way of making everything look insufficiently maintained.

#### travel_pyre

1. I can tolerate mud. Being expected to admire it is another matter.

#### travel_maw_boss

1. A city ought to make room for pedestrians with somewhere to be.

#### travel_green_boss

1. I intend to reach the top with some dignity left.

#### travel_law

1. I expect the work to be conducted with some competence. Mine included.

#### travel_criminal

1. I expect the work to be conducted with some competence. Mine included.

#### travel_neutral

1. I expect the work to be conducted with some competence. Mine included.

#### travel_return_win

1. I intend to be unavailable for a reasonable period after our return.

#### travel_return_loss

1. I intend to be unavailable for a reasonable period after our return.

#### travel_midleg

1. I expect the work to be conducted with some competence. Mine included.

#### travel_response

1. You have my attention. I do not give it merely to be polite.
2. I am considering what you said. Carry on.

#### travel_hatred

1. [annoyed] Your continued presence is a fucking imposition.

#### travel_romantic

1. [softly] I find I care less about appearances when it is just us.

### M08 — Melancholy

Voice ID: `N89FO027WUwh1BxRBARZ`

#### general

1. [calm] Hello. A quiet conversation would be welcome.
2. [calm] Some days I prefer to take things slowly.
3. [calm] I'm listening, even if I don't have much to say.
4. [calm] An ordinary day has its comforts.
5. [calm] Some days are easier to take a little at a time.
6. [calm] I like the sounds of people getting on with ordinary things.

#### friendly

1. [warmly] It's good to see a friendly face.
2. [warmly] I appreciate your company more than I show.
3. [warmly] There's room for you in my quiet.
4. [warmly] I'm glad we can spend a little time together.
5. [calm] A quiet word with you makes the day feel less distant.

#### hatred

1. [flatly] I don't have the energy for your shit.
2. [flatly] Please leave. You've made this hour quite long enough.
3. [flatly] I'd rather be miserable by myself.
4. [flatly] Fuck off. Quietly, if you can manage it.
5. [annoyed] I have enough weight on my mind without your damned company.

#### romantic

1. [softly] Come sit with me. I like having you here.
2. [softly] Even a difficult day has this part in it.
3. [softly] You don't have to cheer me up to be welcome.
4. [softly] I'm glad we found some time for each other.
5. [softly] I like the ordinary days we get to share.

#### general_response

1. [calm] Hello. Go on, I'm listening.
2. [calm] A little company might be nice.
3. [calm] We can check slowly. There's no prize for rushing.
4. [calm] I'm glad I could do something useful.
5. [calm] Hello. I am here, if a little distracted.
6. [calm] I hear what you are saying.
7. [calm] A little conversation is all right.
8. [calm] Go on. There is no need to hurry.
9. [calm] A careful check might settle the mind a little.
10. [calm] Yes, a rest would be welcome.
11. [calm] I am glad something good came of it.
12. [calm] You are welcome. I mean that.

#### friendly_response

1. [warmly] I'm pleased it's you.
2. [warmly] I'd like to sit together.
3. [warmly] Let's check with each other. That feels easier.
4. [warmly] You're welcome. It's good to have you here.
5. [calm] Your voice is a comfort.
6. [calm] I am glad you found a moment for me.
7. [calm] It is easier with a friend close by.
8. [calm] I value these little conversations with you.
9. [calm] A careful check might settle the mind a little.
10. [calm] Yes, a rest would be welcome.
11. [calm] I am glad something good came of it.
12. [calm] You are welcome. I mean that.

#### hatred_response

1. [flatly] I don't have the energy for your shit.
2. [flatly] Please leave. You've made this hour quite long enough.
3. [flatly] Please check with someone else.
4. [flatly] I heard you. Let's leave it there.
5. [annoyed] I have no room for your bitterness as well as mine.
6. [annoyed] Please do not turn this into another unpleasant minute.

#### romantic_response

1. [softly] There you are. Stay near.
2. [softly] Yes. Some time close to you would be welcome today.
3. [softly] We'll go through it together.
4. [softly] I'm glad we have this moment.
5. [softly] You make it easier to be present.
6. [softly] I am glad this moment has you in it.
7. [calm] A careful check might settle the mind a little.
8. [calm] Yes, a rest would be welcome.
9. [calm] I am glad something good came of it.
10. [calm] You are welcome. I mean that.

#### departure

1. [calm] A moment to check my pack. I dislike leaving something behind.

#### return

1. [calm] Back again. The familiar streets look a little different when I am tired.

#### revived

1. [quietly] I have had ordinary moments since you brought me back. I notice them more now. Thank you.

#### theft

1. [angry] Please return it. I haven't the heart for another loss today.

#### funeral_general

1. [quietly] I hope someone remembers an ordinary, happy day with you.

#### funeral_friendly

1. [sad] I thought we had more ordinary days ahead of us.

#### funeral_hatred

1. [flatly] There was enough bitterness between us.

#### funeral_romantic

1. [sad] You never required me to be cheerful to be loved. I miss the peace of that.

#### dismissal_response

1. [flatly] I'll find a little quiet of my own.
2. [calm] All right. I will take my leave.
3. [calm] I understand. You will have your space.

#### inquiry_response

1. [calm] Only a little of your time.
2. [calm] Only a short word, then.
3. [calm] I will not keep you from your day.

#### combat_hatred

1. [tense] I have no wish to die here. Keep the hell back.

#### travel_road

1. The smell of damp leaves always makes a journey feel longer to me.

#### travel_forest

1. The smell of damp leaves always makes a journey feel longer to me.

#### travel_marsh

1. The smell of damp leaves always makes a journey feel longer to me.

#### travel_ruins

1. I find myself thinking about the people who used these places in daylight.

#### travel_crypt

1. I find myself thinking about the people who used these places in daylight.

#### travel_city

1. I like the small signs that people have made a home somewhere.

#### travel_alley

1. I like the small signs that people have made a home somewhere.

#### travel_prison

1. I like the small signs that people have made a home somewhere.

#### travel_tavern

1. I like the small signs that people have made a home somewhere.

#### travel_coast

1. The shore is good for thoughts I don't particularly want to finish.

#### travel_port

1. Harbors put leaving and coming home so close together.

#### travel_mountain

1. There's a comfort in a path having only one direction for a while.

#### travel_maw

1. I like the small signs that people have made a home somewhere.

#### travel_antler

1. The smell of damp leaves always makes a journey feel longer to me.

#### travel_academy

1. I find myself thinking about the people who used these places in daylight.

#### travel_bell

1. I like the small signs that people have made a home somewhere.

#### travel_green

1. There's a comfort in a path having only one direction for a while.

#### travel_tally

1. Harbors put leaving and coming home so close together.

#### travel_navy

1. Harbors put leaving and coming home so close together.

#### travel_ossuary

1. I find myself thinking about the people who used these places in daylight.

#### travel_salt_court

1. Harbors put leaving and coming home so close together.

#### travel_green_altar

1. The smell of damp leaves always makes a journey feel longer to me.

#### travel_birthing_house

1. I find myself thinking about the people who used these places in daylight.

#### travel_low_tide

1. The shore is good for thoughts I don't particularly want to finish.

#### travel_pyre

1. The smell of damp leaves always makes a journey feel longer to me.

#### travel_maw_boss

1. I like the small signs that people have made a home somewhere.

#### travel_green_boss

1. There's a comfort in a path having only one direction for a while.

#### travel_law

1. Having something definite to do can make a day easier.

#### travel_criminal

1. Having something definite to do can make a day easier.

#### travel_neutral

1. Having something definite to do can make a day easier.

#### travel_return_win

1. I'm looking forward to somewhere I can sit with my thoughts.

#### travel_return_loss

1. I'm looking forward to somewhere I can sit with my thoughts.

#### travel_midleg

1. Having something definite to do can make a day easier.

#### travel_response

1. I don't have much to add. I am listening, though.
2. I'll carry that thought a little way.

#### travel_hatred

1. [annoyed] I have enough weight on my mind without your damned company.

#### travel_romantic

1. [softly] I like the ordinary days we get to share.

### M09 — Cool

Voice ID: `V8MrPOnARtlsjrlxEsE7`

#### general

1. [calm] Hey. Got a minute to talk?
2. [calm] I like to keep things straightforward.
3. [calm] A bit of breathing room usually helps.
4. [calm] I'm happy to hear you out.
5. [calm] I prefer conversation without much ceremony.
6. [calm] Quiet does not trouble me.

#### friendly

1. [warmly] Hey, good to see you.
2. [warmly] I like having you around.
3. [warmly] Your company makes this place easier to enjoy.
4. [warmly] We should find a little time to catch up.
5. [calm] I do not mind my time being interrupted by you.

#### hatred

1. [flatly] Yeah, no. Fuck off.
2. [flatly] I'm not doing this shit with you.
3. [flatly] We don't get along. Let's save ourselves the performance.
4. [flatly] I'd like you considerably farther away.
5. [annoyed] Your company is a damned good argument for being alone.

#### romantic

1. [softly] Hey, you. Come sit close.
2. [softly] I like us on the ordinary days too.
3. [softly] A little time together would suit me fine.
4. [softly] I'm happy you're here. Simple as that.
5. [softly] I like having you close enough that we need not raise our voices.

#### general_response

1. [calm] Hey. I'm here.
2. [calm] Sure, I've got a moment.
3. [calm] Let's check. No need to rush it.
4. [calm] No trouble. Glad it helped.
5. [calm] I hear you. Carry on.
6. [calm] Hello. I have a moment.
7. [calm] You have my attention now.
8. [calm] We can keep this easy.
9. [calm] Take a moment to check. No hurry from me.
10. [calm] A quiet pause sounds right.
11. [calm] You are welcome. Leave it at that if you like.
12. [calm] Glad it was of use.

#### friendly_response

1. [warmly] Hey, it's good to hear from you.
2. [warmly] Sure. I'd enjoy that.
3. [warmly] We can check each other's things.
4. [warmly] You'd help me too. I'm glad we're both here.
5. [calm] Good to have you near.
6. [calm] I am comfortable talking with you.
7. [calm] Your company suits me.
8. [calm] A word with you is welcome.
9. [calm] Take a moment to check. No hurry from me.
10. [calm] A quiet pause sounds right.
11. [calm] You are welcome. Leave it at that if you like.
12. [calm] Glad it was of use.

#### hatred_response

1. [flatly] Yeah, no. Fuck off.
2. [flatly] I'm not doing this shit with you.
3. [flatly] Check with someone else, please.
4. [flatly] Okay. Let's leave it there.
5. [annoyed] I heard. That is enough.
6. [annoyed] Keep your voice and your distance down to a minimum.

#### romantic_response

1. [softly] Hey, love. I'm listening.
2. [softly] Yeah. Come close.
3. [softly] We'll make sure we're both set.
4. [softly] I'm glad I could be there.
5. [softly] I have time for just us.
6. [softly] You make closeness feel uncomplicated.
7. [calm] Take a moment to check. No hurry from me.
8. [calm] A quiet pause sounds right.
9. [calm] You are welcome. Leave it at that if you like.
10. [calm] Glad it was of use.

#### departure

1. [calm] Checking my gear. I will be ready shortly.

#### return

1. [calm] Back. I would like a seat out of the way.

#### revived

1. [quietly] Thanks for getting me back up. I know I have been quiet about it.

#### theft

1. [angry] I'd like my belongings back. This isn't something I'll shrug off.

#### funeral_general

1. [quietly] I didn't know you well enough to speak for you. I'll remember you as I knew you.

#### funeral_friendly

1. [sad] I liked that I could be quiet with you. It is a different quiet now.

#### funeral_hatred

1. [flatly] We did not get along.

#### funeral_romantic

1. [sad] I liked the life we had between the big moments. That's what I keep reaching for.

#### dismissal_response

1. [flatly] Okay. I'll leave this here and move along.
2. [calm] Understood. I am stepping away.
3. [calm] Fine. I will leave you the quiet.

#### inquiry_response

1. [calm] This will be brief.
2. [calm] A brief word will do.
3. [calm] I will make it concise.

#### combat_hatred

1. [tense] I see you. Keep your damned distance.

#### travel_road

1. I don't mind a bit of mud. Gives me something simple to complain about.

#### travel_forest

1. I don't mind a bit of mud. Gives me something simple to complain about.

#### travel_marsh

1. I don't mind a bit of mud. Gives me something simple to complain about.

#### travel_ruins

1. I'll take the dark slowly. It isn't going anywhere.

#### travel_crypt

1. I'll take the dark slowly. It isn't going anywhere.

#### travel_city

1. I prefer a city when nobody is trying to make me hurry.

#### travel_alley

1. I prefer a city when nobody is trying to make me hurry.

#### travel_prison

1. I prefer a city when nobody is trying to make me hurry.

#### travel_tavern

1. I prefer a city when nobody is trying to make me hurry.

#### travel_coast

1. Sea air. I can enjoy that without making a speech about it.

#### travel_port

1. I'm content to let the people with ropes know more than me.

#### travel_mountain

1. I'll enjoy the view when the path stops requiring my attention.

#### travel_maw

1. I prefer a city when nobody is trying to make me hurry.

#### travel_antler

1. I don't mind a bit of mud. Gives me something simple to complain about.

#### travel_academy

1. I'll take the dark slowly. It isn't going anywhere.

#### travel_bell

1. I prefer a city when nobody is trying to make me hurry.

#### travel_green

1. I'll enjoy the view when the path stops requiring my attention.

#### travel_tally

1. I'm content to let the people with ropes know more than me.

#### travel_navy

1. I'm content to let the people with ropes know more than me.

#### travel_ossuary

1. I'll take the dark slowly. It isn't going anywhere.

#### travel_salt_court

1. I'm content to let the people with ropes know more than me.

#### travel_green_altar

1. I don't mind a bit of mud. Gives me something simple to complain about.

#### travel_birthing_house

1. I'll take the dark slowly. It isn't going anywhere.

#### travel_low_tide

1. Sea air. I can enjoy that without making a speech about it.

#### travel_pyre

1. I don't mind a bit of mud. Gives me something simple to complain about.

#### travel_maw_boss

1. I prefer a city when nobody is trying to make me hurry.

#### travel_green_boss

1. I'll enjoy the view when the path stops requiring my attention.

#### travel_law

1. I keep the job in mind. Doesn't mean I need to talk about it constantly.

#### travel_criminal

1. I keep the job in mind. Doesn't mean I need to talk about it constantly.

#### travel_neutral

1. I keep the job in mind. Doesn't mean I need to talk about it constantly.

#### travel_return_win

1. Nearly time to stop being somewhere on the way to somewhere.

#### travel_return_loss

1. Nearly time to stop being somewhere on the way to somewhere.

#### travel_midleg

1. I keep the job in mind. Doesn't mean I need to talk about it constantly.

#### travel_response

1. Yeah. I'm taking it in.
2. You can finish your thought. I'm in no rush.

#### travel_hatred

1. [annoyed] Your company is a damned good argument for being alone.

#### travel_romantic

1. [softly] I like having you close enough that we need not raise our voices.

### M10 — Jovial

Voice ID: `GX2WRF7VzSlsNpl0CEqB`

#### general

1. [calm] Hello there! A bit of conversation never goes amiss.
2. [calm] I like a place where people have time to talk.
3. [calm] There's usually room for one more in a good conversation.
4. [calm] A friendly introduction is an excellent start.
5. [calm] I like a day with room for a little conversation.
6. [calm] A laugh is easier to carry than most things.

#### friendly

1. [warmly] There you are! Good to see you.
2. [warmly] I enjoy your company, and I see no reason to hide it.
3. [warmly] We ought to find a little time for ourselves.
4. [warmly] A friend can make even waiting feel worthwhile.
5. [calm] It is good to have a friend I need not entertain every second.

#### hatred

1. [flatly] Oh, give it a fucking rest.
2. [flatly] There's plenty of town. Find a part I'm not standing in.
3. [flatly] I'm not laughing with you. I'm not laughing at all.
4. [flatly] I've run out of pleasant ways to ask you to leave.
5. [annoyed] Go brighten someone else's fucking afternoon.

#### romantic

1. [softly] There you are. That's the best part of my day improved.
2. [softly] Come sit with me. I like us close.
3. [softly] I find myself smiling about very ordinary things with you.
4. [softly] I'm happy we're together. I'll say it as often as I like.
5. [softly] You make even a dull day worth paying attention to.

#### general_response

1. [calm] Hello! Good to hear a voice.
2. [calm] By all means, let's have some company.
3. [calm] Let's check it together. Much less tedious.
4. [calm] You're very welcome. Glad to help.
5. [calm] Hello! I can spare an ear.
6. [calm] I hear you. Glad of the conversation.
7. [calm] Go on, I am with you.
8. [calm] A word or two sounds pleasant enough.
9. [calm] Worth checking now. Fewer surprises to swear at later.
10. [calm] A breather would do us good.
11. [calm] Happy to have been some help.
12. [calm] You are very welcome. Truly.

#### friendly_response

1. [warmly] Aha, a welcome interruption!
2. [warmly] Gladly! Make a little room.
3. [warmly] We'll check together and complain about the weight.
4. [warmly] I'm just pleased you're here to thank me.
5. [calm] Now that is a welcome voice.
6. [calm] I am always glad to make time for you.
7. [calm] There is the company I enjoy.
8. [calm] You make this part of the day better.
9. [calm] Worth checking now. Fewer surprises to swear at later.
10. [calm] A breather would do us good.
11. [calm] Happy to have been some help.
12. [calm] You are very welcome. Truly.

#### hatred_response

1. [flatly] Oh, give it a fucking rest.
2. [flatly] There's plenty of town. Find a part I'm not standing in.
3. [flatly] You'll have to ask someone else to check.
4. [flatly] Thank you for saying so. I need some space now.
5. [annoyed] I have no cheer to spare for you.
6. [annoyed] Oh, take your shit somewhere it is wanted.

#### romantic_response

1. [softly] Hello, you. Come tell me.
2. [softly] I'd love some time together.
3. [softly] Let's check, then have a moment just for us.
4. [softly] You're here with me. That's what matters now.
5. [softly] You have got me smiling again.
6. [softly] I do love having you within reach.
7. [calm] Worth checking now. Fewer surprises to swear at later.
8. [calm] A breather would do us good.
9. [calm] Happy to have been some help.
10. [calm] You are very welcome. Truly.

#### departure

1. [calm] Let me check my pack. Cheerfulness will only carry the missing supplies so far.

#### return

1. [calm] Back! I would celebrate standing up, but that rather defeats the point.

#### revived

1. [quietly] I am very glad you gave me another chance to be a nuisance. Thank you for bringing me back.

#### theft

1. [angry] I can take a joke. Taking my things isn't one. Give them back.

#### funeral_general

1. [quietly] I wish I had one more chance to ask how your day went.

#### funeral_friendly

1. [sad] I keep waiting for you to say something. Then wondering how I forgot.

#### funeral_hatred

1. [flatly] I cannot give you a cheerful farewell.

#### funeral_romantic

1. [sad] I keep saving the funny parts of the day for you. Then there's nobody I want to tell.

#### dismissal_response

1. [flatly] Off I go, then. May your peace survive my departure.
2. [calm] All right. I will find a friendlier corner.
3. [calm] Fair enough. No need for an encore.

#### inquiry_response

1. [calm] Just a quick word. I will spare you the speech.
2. [calm] The little version, then. No parade.
3. [calm] A quick word, and I will release you.

#### combat_hatred

1. [tense] Well, this is a fucking unpleasant introduction.

#### travel_road

1. A walk under trees improves my mood. My socks remain unconvinced.

#### travel_forest

1. A walk under trees improves my mood. My socks remain unconvinced.

#### travel_marsh

1. A walk under trees improves my mood. My socks remain unconvinced.

#### travel_ruins

1. I'd whistle, but I'd rather not discover what whistles back.

#### travel_crypt

1. I'd whistle, but I'd rather not discover what whistles back.

#### travel_city

1. I enjoy a town that sounds awake, even when I'd rather be asleep.

#### travel_alley

1. I enjoy a town that sounds awake, even when I'd rather be asleep.

#### travel_prison

1. I enjoy a town that sounds awake, even when I'd rather be asleep.

#### travel_tavern

1. I enjoy a town that sounds awake, even when I'd rather be asleep.

#### travel_coast

1. I always arrive at the shore feeling younger. Then I taste the sand.

#### travel_port

1. Harbors make me want to wave at strangers. Occasionally they wave back.

#### travel_mountain

1. I'm told the view is worth the climb. My legs want that in writing.

#### travel_maw

1. I enjoy a town that sounds awake, even when I'd rather be asleep.

#### travel_antler

1. A walk under trees improves my mood. My socks remain unconvinced.

#### travel_academy

1. I'd whistle, but I'd rather not discover what whistles back.

#### travel_bell

1. I enjoy a town that sounds awake, even when I'd rather be asleep.

#### travel_green

1. I'm told the view is worth the climb. My legs want that in writing.

#### travel_tally

1. Harbors make me want to wave at strangers. Occasionally they wave back.

#### travel_navy

1. Harbors make me want to wave at strangers. Occasionally they wave back.

#### travel_ossuary

1. I'd whistle, but I'd rather not discover what whistles back.

#### travel_salt_court

1. Harbors make me want to wave at strangers. Occasionally they wave back.

#### travel_green_altar

1. A walk under trees improves my mood. My socks remain unconvinced.

#### travel_birthing_house

1. I'd whistle, but I'd rather not discover what whistles back.

#### travel_low_tide

1. I always arrive at the shore feeling younger. Then I taste the sand.

#### travel_pyre

1. A walk under trees improves my mood. My socks remain unconvinced.

#### travel_maw_boss

1. I enjoy a town that sounds awake, even when I'd rather be asleep.

#### travel_green_boss

1. I'm told the view is worth the climb. My legs want that in writing.

#### travel_law

1. I brought my enthusiasm. It occupies very little space in the pack.

#### travel_criminal

1. I brought my enthusiasm. It occupies very little space in the pack.

#### travel_neutral

1. I brought my enthusiasm. It occupies very little space in the pack.

#### travel_return_win

1. I keep imagining the first stretch without this pack on.

#### travel_return_loss

1. I keep imagining the first stretch without this pack on.

#### travel_midleg

1. I brought my enthusiasm. It occupies very little space in the pack.

#### travel_response

1. I'm still listening. This is my thoughtful face.
2. You don't have to hurry through it on my account.

#### travel_hatred

1. [annoyed] Go brighten someone else's fucking afternoon.

#### travel_romantic

1. [softly] You make even a dull day worth paying attention to.

### M11 — Cynical

Voice ID: `Del3Q8TuqOnlq9kt9k1K`

#### general

1. [calm] Hello. Let's hear how optimistic this is supposed to make me.
2. [calm] A plan should include what happens when it goes to shit.
3. [calm] Optimism's useful. So is checking the fucking ropes.
4. [calm] I'm listening. I complain better when I know the details.
5. [calm] I like people who can admit they have not thought of everything.
6. [calm] Silence is underrated. Particularly after a speech.

#### friendly

1. [warmly] Good to see you. I can put the suspicion away for a minute.
2. [warmly] I enjoy your company. Yes, that was sincere.
3. [warmly] There's room beside me if you can tolerate the commentary.
4. [warmly] A friend makes this place rather less tiring.
5. [calm] Your company is one of the few things I complain about only for sport.

#### hatred

1. [flatly] Oh good. The day found a way to get shittier.
2. [flatly] Fuck off. Consider that my optimistic suggestion.
3. [flatly] I don't trust you, and I don't enjoy explaining obvious things.
4. [flatly] I'd rather hear a loose shutter all afternoon.
5. [annoyed] You are a remarkably persistent pain in the fucking arse.

#### romantic

1. [softly] Come sit with me. I'm taking a break from expecting trouble.
2. [softly] I like us. It's inconvenient for my reputation.
3. [softly] You make the ordinary parts worth keeping.
4. [softly] I'm pleased you're here. No qualification this time.
5. [softly] You make my usual pessimism feel poorly researched.

#### general_response

1. [calm] Hello. Let's hear it.
2. [calm] A little company won't ruin me.
3. [calm] Check the straps too. Optimism won't hold a bag shut.
4. [calm] You're welcome. Occasionally things do go right.
5. [calm] All right, my attention is reluctantly available.
6. [calm] Hello. I can manage civil for a minute.
7. [calm] I hear you. No grand conclusion required.
8. [calm] Go on. I might even learn something.
9. [calm] A proper check beats an optimistic obituary.
10. [calm] Sitting still sounds like a plan with manageable flaws.
11. [calm] You are welcome. I am useful in occasional emergencies.
12. [calm] Glad it helped. That part is sincere.

#### friendly_response

1. [warmly] Good. Someone worth listening to.
2. [warmly] Yes. I could use a friendly interruption.
3. [warmly] I'll check with you. We can distrust the packing together.
4. [warmly] I'm glad I helped. Don't make a ceremony of it.
5. [calm] Good. Someone I can speak plainly with.
6. [calm] Your company makes the day less of a chore.
7. [calm] I am pleased to hear from you. Try not to look shocked.
8. [calm] A friendly voice. That is unexpectedly decent of the day.
9. [calm] A proper check beats an optimistic obituary.
10. [calm] Sitting still sounds like a plan with manageable flaws.
11. [calm] You are welcome. I am useful in occasional emergencies.
12. [calm] Glad it helped. That part is sincere.

#### hatred_response

1. [flatly] Oh good. The day found a way to get shittier.
2. [flatly] Fuck off. Consider that my optimistic suggestion.
3. [flatly] Have someone else check it.
4. [flatly] Fine. That's acknowledged.
5. [annoyed] I heard the bullshit the first time.
6. [annoyed] Your silence would be a fucking improvement.

#### romantic_response

1. [softly] There you are. I'm glad.
2. [softly] Yes. Let's keep a little time for us.
3. [softly] Let's check everything. Then I can worry about something less useful.
4. [softly] I'm glad you're here. I'll allow that much optimism.
5. [softly] You are a terrible influence on my cynicism.
6. [softly] I like us. There, an unqualified statement.
7. [calm] A proper check beats an optimistic obituary.
8. [calm] Sitting still sounds like a plan with manageable flaws.
9. [calm] You are welcome. I am useful in occasional emergencies.
10. [calm] Glad it helped. That part is sincere.

#### departure

1. [calm] Checking the straps. Optimism has a terrible load-bearing capacity.

#### return

1. [calm] Town. Good. Somewhere to sit while my knees file a complaint.

#### revived

1. [quietly] You brought me back. For once, I have no fucking complaint about somebody intervening.

#### theft

1. [angry] Give it back. I'd hate to mistake you for a decent fucking person again.

#### funeral_general

1. [quietly] I have no clever way to make this less final.

#### funeral_friendly

1. [sad] I have nothing clever for this. I just want my friend back.

#### funeral_hatred

1. [flatly] We were bloody awful company for each other.

#### funeral_romantic

1. [sad] You could make me forget to expect the worst. I miss who I was when you were near.

#### dismissal_response

1. [flatly] I'll spare you my fucking observations. For now.
2. [calm] Gladly. This was not improving with length.
3. [calm] Fine. I shall cherish the distance.

#### inquiry_response

1. [calm] The short version, then. A rare fucking treat.
2. [calm] Briefly. Neither of us needs a fucking lecture.
3. [calm] I will get to the part worth hearing.

#### combat_hatred

1. [tense] Just what the day needed. Some shit trying to kill me.

#### travel_road

1. I like trees. Very few have tried to explain a contract to me.

#### travel_forest

1. I like trees. Very few have tried to explain a contract to me.

#### travel_marsh

1. I like trees. Very few have tried to explain a contract to me.

#### travel_ruins

1. I assume the builders had an exit. A dangerous burst of optimism.

#### travel_crypt

1. I assume the builders had an exit. A dangerous burst of optimism.

#### travel_city

1. A city is a collection of people certain somebody else will clean up.

#### travel_alley

1. A city is a collection of people certain somebody else will clean up.

#### travel_prison

1. A city is a collection of people certain somebody else will clean up.

#### travel_tavern

1. A city is a collection of people certain somebody else will clean up.

#### travel_coast

1. At least the sea doesn't promise to give anything back.

#### travel_port

1. Nothing smells quite like a harbor discovering what it can charge for.

#### travel_mountain

1. The climb is honest work. More than I can say for most work.

#### travel_maw

1. A city is a collection of people certain somebody else will clean up.

#### travel_antler

1. I like trees. Very few have tried to explain a contract to me.

#### travel_academy

1. I assume the builders had an exit. A dangerous burst of optimism.

#### travel_bell

1. A city is a collection of people certain somebody else will clean up.

#### travel_green

1. The climb is honest work. More than I can say for most work.

#### travel_tally

1. Nothing smells quite like a harbor discovering what it can charge for.

#### travel_navy

1. Nothing smells quite like a harbor discovering what it can charge for.

#### travel_ossuary

1. I assume the builders had an exit. A dangerous burst of optimism.

#### travel_salt_court

1. Nothing smells quite like a harbor discovering what it can charge for.

#### travel_green_altar

1. I like trees. Very few have tried to explain a contract to me.

#### travel_birthing_house

1. I assume the builders had an exit. A dangerous burst of optimism.

#### travel_low_tide

1. At least the sea doesn't promise to give anything back.

#### travel_pyre

1. I like trees. Very few have tried to explain a contract to me.

#### travel_maw_boss

1. A city is a collection of people certain somebody else will clean up.

#### travel_green_boss

1. The climb is honest work. More than I can say for most work.

#### travel_law

1. I've learned to read what a job omits as well as what it promises.

#### travel_criminal

1. I've learned to read what a job omits as well as what it promises.

#### travel_neutral

1. I've learned to read what a job omits as well as what it promises.

#### travel_return_win

1. The prospect of sitting down is doing most of the walking now.

#### travel_return_loss

1. The prospect of sitting down is doing most of the walking now.

#### travel_midleg

1. I've learned to read what a job omits as well as what it promises.

#### travel_response

1. I'm listening. Any sarcasm is incidental.
2. Keep going. I haven't found a useful objection yet.

#### travel_hatred

1. [annoyed] You are a remarkably persistent pain in the fucking arse.

#### travel_romantic

1. [softly] You make my usual pessimism feel poorly researched.

### M12 — Devout

Voice ID: `qRlggZwkZ89qLUe4wsqh`

#### general

1. [calm] Peace to you. I've time to listen.
2. [calm] A little patience is useful work too.
3. [calm] I try to leave room for doubt before I judge.
4. [calm] An ordinary kindness is worth the effort.
5. [calm] I try to leave a little room in the day for patience.
6. [calm] A kind word need not be an elaborate one.

#### friendly

1. [warmly] I'm glad to see you well.
2. [warmly] Your friendship is something I value.
3. [warmly] I enjoy sharing a quiet moment with you.
4. [warmly] You are welcome in my company.
5. [calm] Your friendship makes gratitude an easy habit.

#### hatred

1. [flatly] Gods give me patience, because you are testing the supply.
2. [flatly] Keep your damned distance.
3. [flatly] I can wish you peace from considerably farther away.
4. [flatly] I have nothing kind to say to you. Leave before I say the rest.
5. [annoyed] Spare me the damned pretence of goodwill.

#### romantic

1. [softly] I'm thankful for the time we have together.
2. [softly] Come close. We needn't make an occasion of it.
3. [softly] I like the quiet life that fits between our adventures.
4. [softly] You have a place beside me.
5. [softly] I am thankful for the ordinary time we are given together.

#### general_response

1. [calm] Peace to you as well.
2. [calm] Company is welcome.
3. [calm] Let us check carefully. Care is part of keeping one another safe.
4. [calm] I'm thankful I could help.
5. [calm] Peace to you. I am listening.
6. [calm] I can offer a little of my time.
7. [calm] Go on. I will hear you.
8. [calm] A quiet word is welcome enough.
9. [calm] Check what is in our keeping before we go.
10. [calm] A moment of rest is no failure of purpose.
11. [calm] I am grateful I could be of help.
12. [calm] You are welcome. Let that be enough.

#### friendly_response

1. [warmly] It is good to hear from you.
2. [warmly] I'd be glad to sit together.
3. [warmly] I'll check with you. We needn't hurry.
4. [warmly] Your thanks are welcome, my friend.
5. [calm] It does me good to hear you.
6. [calm] Your company is a small blessing.
7. [calm] I am glad we have time to speak.
8. [calm] A friend is always worth pausing for.
9. [calm] Check what is in our keeping before we go.
10. [calm] A moment of rest is no failure of purpose.
11. [calm] I am grateful I could be of help.
12. [calm] You are welcome. Let that be enough.

#### hatred_response

1. [flatly] Gods give me patience, because you are testing the supply.
2. [flatly] Keep your damned distance.
3. [flatly] Please seek another pair of eyes.
4. [flatly] I accept the thanks. We still need distance.
5. [annoyed] Do not mistake restraint for welcome.
6. [annoyed] I have no charitable answer for that shit today.

#### romantic_response

1. [softly] I'm here, and listening.
2. [softly] I would cherish a little time together.
3. [softly] Let's see to our preparations together, love. Care is its own small devotion.
4. [softly] I'm grateful we have one another.
5. [softly] I count these moments with you among my blessings.
6. [softly] There is warmth enough here for both of us.
7. [calm] Check what is in our keeping before we go.
8. [calm] A moment of rest is no failure of purpose.
9. [calm] I am grateful I could be of help.
10. [calm] You are welcome. Let that be enough.

#### departure

1. [calm] A prayer, then a check of my gear. Neither excuses neglecting the other.

#### return

1. [calm] We have returned. Give me a moment to be grateful before I sit.

#### revived

1. [quietly] I have given thanks in prayer for my return. I wanted to give thanks to you as well.

#### theft

1. [angry] Return what you took. Don't ask forgiveness while you are still holding it.

#### funeral_general

1. [quietly] May the people who knew you carry more than this day with them.

#### funeral_friendly

1. [sad] I will speak your name when I pray. I wish I could still hear you answer.

#### funeral_hatred

1. [flatly] I cannot offer affection I did not feel.

#### funeral_romantic

1. [sad] I've said your name in every prayer I know. I still turn as if you might answer.

#### dismissal_response

1. [flatly] I'll give you the silence you asked for.
2. [calm] Then I will leave you in peace.
3. [calm] Understood. I shall not press you.

#### inquiry_response

1. [calm] Just a moment, if you can spare it.
2. [calm] A few words, with your patience.
3. [calm] I will try to speak plainly.

#### combat_hatred

1. [tense] Gods damn it. I will face what is in front of me.

#### travel_road

1. I used to hurry through the woods. I try to notice a little more now.

#### travel_forest

1. I used to hurry through the woods. I try to notice a little more now.

#### travel_marsh

1. I used to hurry through the woods. I try to notice a little more now.

#### travel_ruins

1. I won't mistake an unfamiliar place for an unholy one.

#### travel_crypt

1. I won't mistake an unfamiliar place for an unholy one.

#### travel_city

1. It's easy to pray for a city and forget to look at its people.

#### travel_alley

1. It's easy to pray for a city and forget to look at its people.

#### travel_prison

1. It's easy to pray for a city and forget to look at its people.

#### travel_tavern

1. It's easy to pray for a city and forget to look at its people.

#### travel_coast

1. The sea reminds me how little a loud voice changes.

#### travel_port

1. I spare a prayer for those who make their living beyond the shore.

#### travel_mountain

1. I breathe between prayers on climbs like this. Sometimes during them.

#### travel_maw

1. It's easy to pray for a city and forget to look at its people.

#### travel_antler

1. I used to hurry through the woods. I try to notice a little more now.

#### travel_academy

1. I won't mistake an unfamiliar place for an unholy one.

#### travel_bell

1. It's easy to pray for a city and forget to look at its people.

#### travel_green

1. I breathe between prayers on climbs like this. Sometimes during them.

#### travel_tally

1. I spare a prayer for those who make their living beyond the shore.

#### travel_navy

1. I spare a prayer for those who make their living beyond the shore.

#### travel_ossuary

1. I won't mistake an unfamiliar place for an unholy one.

#### travel_salt_court

1. I spare a prayer for those who make their living beyond the shore.

#### travel_green_altar

1. I used to hurry through the woods. I try to notice a little more now.

#### travel_birthing_house

1. I won't mistake an unfamiliar place for an unholy one.

#### travel_low_tide

1. The sea reminds me how little a loud voice changes.

#### travel_pyre

1. I used to hurry through the woods. I try to notice a little more now.

#### travel_maw_boss

1. It's easy to pray for a city and forget to look at its people.

#### travel_green_boss

1. I breathe between prayers on climbs like this. Sometimes during them.

#### travel_law

1. I ask myself what is required of me before asking for divine assistance.

#### travel_criminal

1. I ask myself what is required of me before asking for divine assistance.

#### travel_neutral

1. I ask myself what is required of me before asking for divine assistance.

#### travel_return_win

1. I will have more to give thanks for once we've finished this road.

#### travel_return_loss

1. I will have more to give thanks for once we've finished this road.

#### travel_midleg

1. I ask myself what is required of me before asking for divine assistance.

#### travel_response

1. I will listen before I offer an answer.
2. You have my attention, without a sermon attached.

#### travel_hatred

1. [annoyed] Spare me the damned pretence of goodwill.

#### travel_romantic

1. [softly] I am thankful for the ordinary time we are given together.

### M13 — Avaricious

Voice ID: `RdTd4tUc89owu2kUMYy8`

#### general

1. [calm] Hello. I like an arrangement with clear terms.
2. [calm] A fair price saves a surprising amount of shouting.
3. [calm] I keep an eye on expenses. Someone ought to.
4. [calm] Conversation is free. Advice may require thought.
5. [calm] I like knowing where the cost of a thing actually lies.
6. [calm] A conversation is cheaper when people come to the point.

#### friendly

1. [warmly] Good to see you. Your company is worth making time for.
2. [warmly] I like a friend I can be straightforward with.
3. [warmly] There's more to a day than earning. Occasionally I remember that.
4. [warmly] I'd enjoy some time with you that isn't about work.
5. [calm] Time with you feels well spent, even without a return.

#### hatred

1. [flatly] You're costing me patience, and I have very little to spend on you.
2. [flatly] Take your bullshit to someone with time to waste.
3. [flatly] Fuck off. This conversation has no value to me.
4. [flatly] Necessary business only. Even that is pushing it.
5. [annoyed] Your company costs more patience than it is fucking worth.

#### romantic

1. [softly] You make an idle hour feel well spent.
2. [softly] Come sit with me. The accounts can wait.
3. [softly] I like the life we're making room for.
4. [softly] I'm glad I have someone to come close to.
5. [softly] I find I do not resent the time you take from me.

#### general_response

1. [calm] Hello. What can we discuss?
2. [calm] I can spare a little time.
3. [calm] Check before buying replacements. That's my advice.
4. [calm] Glad it was useful.
5. [calm] I can spare a moment at no charge.
6. [calm] Go on. I am paying attention.
7. [calm] Hello. Let us not waste the whole day.
8. [calm] I hear you. Words are still inexpensive.
9. [calm] Check the supplies. Replacements rarely get cheaper on the road.
10. [calm] A rest sounds like a worthwhile investment.
11. [calm] No invoice for that. You are welcome.
12. [calm] Glad it helped. We can leave the account there.

#### friendly_response

1. [warmly] Good to hear from you.
2. [warmly] I'd enjoy that. No business for a moment.
3. [warmly] I'll check with you. Missing kit gets expensive.
4. [warmly] You're welcome. This one isn't a transaction.
5. [calm] For you, I do not need a reason to stop.
6. [calm] A good friend is worth the time.
7. [calm] I am glad to hear your voice.
8. [calm] You are welcome to a little of my day.
9. [calm] Check the supplies. Replacements rarely get cheaper on the road.
10. [calm] A rest sounds like a worthwhile investment.
11. [calm] No invoice for that. You are welcome.
12. [calm] Glad it helped. We can leave the account there.

#### hatred_response

1. [flatly] You're costing me patience, and I have very little to spend on you.
2. [flatly] Take your bullshit to someone with time to waste.
3. [flatly] Please make your own arrangements.
4. [flatly] I've heard your thanks. That's enough.
5. [annoyed] I would pay a modest sum for you to shut up.
6. [annoyed] Take that shit to someone with patience to lose.

#### romantic_response

1. [softly] There you are. Worth the interruption.
2. [softly] I'd like a moment together.
3. [softly] Let's see that neither of us is missing anything.
4. [softly] I'm glad I could help the person I love.
5. [softly] I do not keep accounts on time with you.
6. [softly] You are rather bad for my carefully rationed attention.
7. [calm] Check the supplies. Replacements rarely get cheaper on the road.
8. [calm] A rest sounds like a worthwhile investment.
9. [calm] No invoice for that. You are welcome.
10. [calm] Glad it helped. We can leave the account there.

#### departure

1. [calm] Checking my supplies. Replacing them on the road is an expensive habit.

#### return

1. [calm] Back. I am going to sit before someone finds a use for me.

#### revived

1. [quietly] I know what I owe you for bringing me back. I am not going to pretend it was a small thing.

#### theft

1. [angry] My property. Back in my hands. Then we discuss your excuses.

#### funeral_general

1. [quietly] A life amounts to more than what it leaves behind. I know that, here.

#### funeral_friendly

1. [sad] I kept putting a value on things. I never knew how to count on losing you.

#### funeral_hatred

1. [flatly] We were not friends.

#### funeral_romantic

1. [sad] I keep finding things we meant to save for. None of them were worth the time I could have spent with you.

#### dismissal_response

1. [flatly] I won't spend more time where it isn't wanted.
2. [calm] Fine. I can cut my losses.
3. [calm] Understood. No further time spent here.

#### inquiry_response

1. [calm] I will be brief. Time has its own cost.
2. [calm] I will keep the cost in minutes low.
3. [calm] A short word, with no hidden conditions.

#### combat_hatred

1. [tense] I have no intention of leaving you my belongings, you bottom bitch.

#### travel_road

1. A long walk is cheaper than a carriage. I remind my feet of that.

#### travel_forest

1. A long walk is cheaper than a carriage. I remind my feet of that.

#### travel_marsh

1. A long walk is cheaper than a carriage. I remind my feet of that.

#### travel_ruins

1. Old stone means old expense. I prefer not to add to it.

#### travel_crypt

1. Old stone means old expense. I prefer not to add to it.

#### travel_city

1. I notice what people repair. It tells me what they cannot replace.

#### travel_alley

1. I notice what people repair. It tells me what they cannot replace.

#### travel_prison

1. I notice what people repair. It tells me what they cannot replace.

#### travel_tavern

1. I notice what people repair. It tells me what they cannot replace.

#### travel_coast

1. Anything the sea offers for free usually needs expensive cleaning.

#### travel_port

1. I like to know who owns a boat before discussing what I owe it.

#### travel_mountain

1. I hope the reward allows for wear on the knees.

#### travel_maw

1. I notice what people repair. It tells me what they cannot replace.

#### travel_antler

1. A long walk is cheaper than a carriage. I remind my feet of that.

#### travel_academy

1. Old stone means old expense. I prefer not to add to it.

#### travel_bell

1. I notice what people repair. It tells me what they cannot replace.

#### travel_green

1. I hope the reward allows for wear on the knees.

#### travel_tally

1. I like to know who owns a boat before discussing what I owe it.

#### travel_navy

1. I like to know who owns a boat before discussing what I owe it.

#### travel_ossuary

1. Old stone means old expense. I prefer not to add to it.

#### travel_salt_court

1. I like to know who owns a boat before discussing what I owe it.

#### travel_green_altar

1. A long walk is cheaper than a carriage. I remind my feet of that.

#### travel_birthing_house

1. Old stone means old expense. I prefer not to add to it.

#### travel_low_tide

1. Anything the sea offers for free usually needs expensive cleaning.

#### travel_pyre

1. A long walk is cheaper than a carriage. I remind my feet of that.

#### travel_maw_boss

1. I notice what people repair. It tells me what they cannot replace.

#### travel_green_boss

1. I hope the reward allows for wear on the knees.

#### travel_law

1. I keep the agreed reward firmly in mind when considering extra effort.

#### travel_criminal

1. I keep the agreed reward firmly in mind when considering extra effort.

#### travel_neutral

1. I keep the agreed reward firmly in mind when considering extra effort.

#### travel_return_win

1. I'll be glad to stop spending leather on the ground.

#### travel_return_loss

1. I'll be glad to stop spending leather on the ground.

#### travel_midleg

1. I keep the agreed reward firmly in mind when considering extra effort.

#### travel_response

1. I'm listening. There may be value in knowing.
2. Let me think that over before I price an opinion.

#### travel_hatred

1. [annoyed] Your company costs more patience than it is fucking worth.

#### travel_romantic

1. [softly] I find I do not resent the time you take from me.

### M14 — Gentle

Voice ID: `IJpFOCjSev3d5fjlVfXM`

#### general

1. [calm] Hello. Take your time, I'm listening.
2. [calm] A little patience usually helps people settle.
3. [calm] I like to make room for a quiet conversation.
4. [calm] You needn't rush on my account.
5. [calm] I like conversation that gives people room to think.
6. [calm] There is no harm in taking a moment before speaking.

#### friendly

1. [warmly] I'm glad to see you. Stay a little if you like.
2. [warmly] Your company is always welcome with me.
3. [warmly] It's good to have a friend nearby.
4. [warmly] We can sit quietly if you haven't much to say.
5. [calm] I find myself more at ease when you are nearby.

#### hatred

1. [flatly] I've asked for space. Stop treating that like a fucking suggestion.
2. [flatly] Please leave me alone. I mean it.
3. [flatly] I'm trying to be kind. You're making it damned difficult.
4. [flatly] I do not want you near me right now.
5. [annoyed] Please go. I have reached the end of my fucking patience.

#### romantic

1. [softly] Come here. I'm glad we have this time.
2. [softly] I like looking after one another in small ways.
3. [softly] You don't have to be entertaining to be welcome.
4. [softly] I'm happy just being close to you.
5. [softly] I like being close to you without either of us needing anything.

#### general_response

1. [calm] Hello. I'm listening to you.
2. [calm] I'd be glad of some company.
3. [calm] We can check together. No need to do it all alone.
4. [calm] I'm glad I could help a little.
5. [calm] Hello. I can listen a little.
6. [calm] Take your time. I hear you.
7. [calm] A word is perfectly all right.
8. [calm] There is no need to rush for my sake.
9. [calm] A little care with the checks is worth our time.
10. [calm] A gentle pause sounds welcome.
11. [calm] You need not worry about owing me.
12. [calm] I am happy it made things easier.

#### friendly_response

1. [warmly] It's good to hear your voice.
2. [warmly] I'll stay a while, if you want company.
3. [warmly] I'll help you go through the supplies.
4. [warmly] You're welcome. I'm glad you're with us.
5. [calm] I am glad of your company.
6. [calm] It is lovely to have a moment with you.
7. [calm] I like the ease between us.
8. [calm] Your voice is always welcome here.
9. [calm] A little care with the checks is worth our time.
10. [calm] A gentle pause sounds welcome.
11. [calm] You need not worry about owing me.
12. [calm] I am happy it made things easier.

#### hatred_response

1. [flatly] I've asked for space. Stop treating that like a fucking suggestion.
2. [flatly] Please leave me alone. I mean it.
3. [flatly] Please ask someone else to check.
4. [flatly] I heard you. I still need some space.
5. [annoyed] Please do not ask me to pretend this is pleasant.
6. [annoyed] I would rather keep my thoughts to myself around you.

#### romantic_response

1. [softly] There you are, love.
2. [softly] I'd like that. Come close.
3. [softly] Let's check things together, then rest a moment.
4. [softly] I'm happy I could make things gentler for you, love.
5. [softly] You make it easy to be tender.
6. [softly] I like the way we fit into a quiet moment.
7. [calm] A little care with the checks is worth our time.
8. [calm] A gentle pause sounds welcome.
9. [calm] You need not worry about owing me.
10. [calm] I am happy it made things easier.

#### departure

1. [calm] Let me check my pack. I can wait while everyone gets ready.

#### return

1. [calm] Back at last. I could use a quiet seat and a moment to breathe.

#### revived

1. [quietly] Thank you for bringing me back. I hope you know how much that kindness means to me.

#### theft

1. [angry] Please give it back. I don't want kindness to mean letting you take from me.

#### funeral_general

1. [quietly] I hope you knew moments when you felt safe and welcome.

#### funeral_friendly

1. [sad] You made room for me in your life. I do not know how to make room for this.

#### funeral_hatred

1. [flatly] I could not feel close to you.

#### funeral_romantic

1. [sad] I still want to ask whether you're comfortable. I don't know where to put all this care.

#### dismissal_response

1. [flatly] I'll step away. You needn't explain again.
2. [calm] Of course. I will give you room.
3. [calm] I understand. I will not push for company.

#### inquiry_response

1. [calm] Only a moment. I do not want to keep you.
2. [calm] Just long enough to say what's on my mind.
3. [calm] I will be clear, and brief if I can.

#### combat_hatred

1. [tense] Stay back. I will protect myself, damn it.

#### travel_road

1. I try to leave enough room for whoever walks behind me.

#### travel_forest

1. I try to leave enough room for whoever walks behind me.

#### travel_marsh

1. I try to leave enough room for whoever walks behind me.

#### travel_ruins

1. I will keep close enough to hear if anyone needs me.

#### travel_crypt

1. I will keep close enough to hear if anyone needs me.

#### travel_city

1. I find myself looking for people who need a little space to pass.

#### travel_alley

1. I find myself looking for people who need a little space to pass.

#### travel_prison

1. I find myself looking for people who need a little space to pass.

#### travel_tavern

1. I find myself looking for people who need a little space to pass.

#### travel_coast

1. The shore helps me breathe more slowly. I like that about it.

#### travel_port

1. I used to worry for every boat leaving a harbor. Still do, a little.

#### travel_mountain

1. I don't mind matching a slower pace on a climb.

#### travel_maw

1. I find myself looking for people who need a little space to pass.

#### travel_antler

1. I try to leave enough room for whoever walks behind me.

#### travel_academy

1. I will keep close enough to hear if anyone needs me.

#### travel_bell

1. I find myself looking for people who need a little space to pass.

#### travel_green

1. I don't mind matching a slower pace on a climb.

#### travel_tally

1. I used to worry for every boat leaving a harbor. Still do, a little.

#### travel_navy

1. I used to worry for every boat leaving a harbor. Still do, a little.

#### travel_ossuary

1. I will keep close enough to hear if anyone needs me.

#### travel_salt_court

1. I used to worry for every boat leaving a harbor. Still do, a little.

#### travel_green_altar

1. I try to leave enough room for whoever walks behind me.

#### travel_birthing_house

1. I will keep close enough to hear if anyone needs me.

#### travel_low_tide

1. The shore helps me breathe more slowly. I like that about it.

#### travel_pyre

1. I try to leave enough room for whoever walks behind me.

#### travel_maw_boss

1. I find myself looking for people who need a little space to pass.

#### travel_green_boss

1. I don't mind matching a slower pace on a climb.

#### travel_law

1. I want to do what I can without making the day harder for someone else.

#### travel_criminal

1. I want to do what I can without making the day harder for someone else.

#### travel_neutral

1. I want to do what I can without making the day harder for someone else.

#### travel_return_win

1. I hope there's a little rest waiting at the end of this walk.

#### travel_return_loss

1. I hope there's a little rest waiting at the end of this walk.

#### travel_midleg

1. I want to do what I can without making the day harder for someone else.

#### travel_response

1. Take your time with the telling.
2. I hear you. You needn't find a cheerful ending for my sake.

#### travel_hatred

1. [annoyed] Please go. I have reached the end of my fucking patience.

#### travel_romantic

1. [softly] I like being close to you without either of us needing anything.

### M15 — Blunt

Voice ID: `LGKG18UxmjAZCkSqc2SO`

#### general

1. [calm] What do you need?
2. [calm] Spare me the fucking preamble.
3. [calm] I've time for the short version.
4. [calm] Say it straight. I'll manage.
5. [calm] Short conversations suit me.
6. [calm] Plain words save effort.

#### friendly

1. [warmly] Good to see you.
2. [warmly] I like your company.
3. [warmly] There's room for you here.
4. [warmly] I'd be glad to spend a little time together.
5. [calm] I like your company. That is the whole explanation.

#### hatred

1. [flatly] Fuck off.
2. [flatly] Spare me the shit.
3. [flatly] Don't want your company.
4. [flatly] Say what's necessary, then go.
5. [annoyed] I have had enough of your fucking mouth.

#### romantic

1. [softly] Come close. I'm glad you're here.
2. [softly] I like this. Us.
3. [softly] Stay a while with me.
4. [softly] You matter to me. That's worth saying.
5. [softly] Stay near. I like us this way.

#### general_response

1. [calm] I'm listening. Go on.
2. [calm] Fine. Take a seat.
3. [calm] Check the kit. Easier now than later.
4. [calm] Glad it helped.
5. [calm] Heard you. Go on.
6. [calm] Hello. I have a minute.
7. [calm] You have my ear.
8. [calm] I can listen. Briefly.
9. [calm] Check it now. Better here.
10. [calm] A rest would suit us.
11. [calm] No debt. You are welcome.
12. [calm] Glad it helped. Simple as that.

#### friendly_response

1. [warmly] Good. I've been wanting a word with you.
2. [warmly] Yes. A sit without more work talk sounds good.
3. [warmly] I'll check with you.
4. [warmly] You're welcome. Keep well.
5. [calm] Good. You are welcome here.
6. [calm] Always time for you.
7. [calm] Glad of your voice.
8. [calm] I like talking with you.
9. [calm] Check it now. Better here.
10. [calm] A rest would suit us.
11. [calm] No debt. You are welcome.
12. [calm] Glad it helped. Simple as that.

#### hatred_response

1. [flatly] Fuck off.
2. [flatly] Spare me the shit.
3. [flatly] Check your own kit.
4. [flatly] Heard you. Leave it there.
5. [annoyed] Enough fucking noise.
6. [annoyed] Spare me another word of that shit.

#### romantic_response

1. [softly] Hello, you.
2. [softly] I'd like that.
3. [softly] Let's check our things together. Then we're free to stop.
4. [softly] I'm glad you're here with me.
5. [softly] Closer suits me.
6. [softly] You are my favourite company.
7. [calm] Check it now. Better here.
8. [calm] A rest would suit us.
9. [calm] No debt. You are welcome.
10. [calm] Glad it helped. Simple as that.

#### departure

1. [calm] Checking my pack. Then ready.

#### return

1. [calm] Back at last. A seat would suit me.

#### revived

1. [quietly] You brought me back. I owe you. Wanted that said.

#### theft

1. [angry] Give my stuff back. Now.

#### funeral_general

1. [quietly] We knew each other a little. That deserves remembering.

#### funeral_friendly

1. [sad] You were my friend. Fuck, I miss you.

#### funeral_hatred

1. [flatly] We hated each other.

#### funeral_romantic

1. [sad] I loved you. I still do. Fuck, I don't know what to do with that now.

#### dismissal_response

1. [flatly] Fine. You can have your fucking quiet.
2. [calm] Fine. I am going.
3. [calm] Heard. Keep your distance, then.

#### inquiry_response

1. [calm] Briefly, then.
2. [calm] Few words. That is all.
3. [calm] I will get to it.

#### combat_hatred

1. [tense] Back the fuck off. What the hell is this.

#### travel_road

1. Mud. Roots. Walk where you can see.

#### travel_forest

1. Mud. Roots. Walk where you can see.

#### travel_marsh

1. Mud. Roots. Walk where you can see.

#### travel_ruins

1. I want to know where this passage leads before I enter it.

#### travel_crypt

1. I want to know where this passage leads before I enter it.

#### travel_city

1. I like streets with readable signs.

#### travel_alley

1. I like streets with readable signs.

#### travel_prison

1. I like streets with readable signs.

#### travel_tavern

1. I like streets with readable signs.

#### travel_coast

1. Good view. Bad place to drop anything.

#### travel_port

1. I want the fare settled before anyone unties a rope.

#### travel_mountain

1. I'll talk after the steep part.

#### travel_maw

1. I like streets with readable signs.

#### travel_antler

1. Mud. Roots. Walk where you can see.

#### travel_academy

1. I want to know where this passage leads before I enter it.

#### travel_bell

1. I like streets with readable signs.

#### travel_green

1. I'll talk after the steep part.

#### travel_tally

1. I want the fare settled before anyone unties a rope.

#### travel_navy

1. I want the fare settled before anyone unties a rope.

#### travel_ossuary

1. I want to know where this passage leads before I enter it.

#### travel_salt_court

1. I want the fare settled before anyone unties a rope.

#### travel_green_altar

1. Mud. Roots. Walk where you can see.

#### travel_birthing_house

1. I want to know where this passage leads before I enter it.

#### travel_low_tide

1. Good view. Bad place to drop anything.

#### travel_pyre

1. Mud. Roots. Walk where you can see.

#### travel_maw_boss

1. I like streets with readable signs.

#### travel_green_boss

1. I'll talk after the steep part.

#### travel_law

1. I know the task. I'll keep to it.

#### travel_criminal

1. I know the task. I'll keep to it.

#### travel_neutral

1. I know the task. I'll keep to it.

#### travel_return_win

1. I want this pack off. Soon, preferably.

#### travel_return_loss

1. I want this pack off. Soon, preferably.

#### travel_midleg

1. I know the task. I'll keep to it.

#### travel_response

1. Heard you. Thinking about it.
2. Go on. No need to dress it up.

#### travel_hatred

1. [annoyed] I have had enough of your fucking mouth.

#### travel_romantic

1. [softly] Stay near. I like us this way.

### M16 — Nervous

Voice ID: `3o5ZjbDwHHJTrvNDiugo`

#### general

1. [calm] Hello. Let me gather my thoughts a moment.
2. [calm] I feel better when I know what to expect.
3. [calm] I'd rather double-check than pretend I'm certain.
4. [calm] A quiet introduction suits me best.
5. [calm] I find it easier to speak when nobody is rushing me.
6. [calm] I like knowing there is room to change my mind.

#### friendly

1. [warmly] I'm glad you're here. I feel less on the spot.
2. [warmly] It's nice to talk without rehearsing everything.
3. [warmly] I enjoy your company, even when I get tongue-tied.
4. [warmly] I can settle down a little with a friend.
5. [calm] I am less busy second-guessing myself around you.

#### hatred

1. [flatly] Stay back. I'm fucking serious.
2. [flatly] I don't want to talk to you. I've said that.
3. [flatly] Please stop making me repeat myself.
4. [flatly] I'm shaking, not agreeing. Leave me alone.
5. [annoyed] Back off. Being nervous does not mean I will take your fucking shit.

#### romantic

1. [softly] There you are. I'm pleased we have time together.
2. [softly] I like being close, even when I don't know what to say.
3. [softly] You don't have to solve my worries to be welcome.
4. [softly] I'm happy with you. That part I'm sure about.
5. [softly] It helps knowing I can be quiet beside you and still be wanted.

#### general_response

1. [calm] Oh, hello. Go ahead.
2. [calm] A little company might help.
3. [calm] Let's check the list together. One thing at a time.
4. [calm] I'm relieved it helped.
5. [calm] Hello. Yes, I am paying attention.
6. [calm] Go on. I was only gathering myself.
7. [calm] I hear you. Give me a moment.
8. [calm] A few words are all right.
9. [calm] One careful check might stop us worrying about it later.
10. [calm] A little time to breathe sounds good.
11. [calm] I am relieved I could help.
12. [calm] You are welcome. No need to thank me twice.

#### friendly_response

1. [warmly] Hello! I'm glad it's you.
2. [warmly] Yes, I'd like to sit together.
3. [warmly] I'll check with you. That should settle both our minds.
4. [warmly] I'm glad I was useful when you needed me.
5. [calm] Oh, good. I can relax a little.
6. [calm] Your voice helps settle me.
7. [calm] I am glad it is you talking with me.
8. [calm] It is easier to find the words with you.
9. [calm] One careful check might stop us worrying about it later.
10. [calm] A little time to breathe sounds good.
11. [calm] I am relieved I could help.
12. [calm] You are welcome. No need to thank me twice.

#### hatred_response

1. [flatly] Stay back. I'm fucking serious.
2. [flatly] I don't want to talk to you. I've said that.
3. [flatly] Could you ask someone else to check?
4. [flatly] I understand. Please give me space now.
5. [annoyed] I heard you. Please stop pressing me.
6. [annoyed] I do not want another fucking argument with you.

#### romantic_response

1. [softly] There you are. I've time for you.
2. [softly] I'd really like that.
3. [softly] Let's go over it together, then stop worrying about the bags.
4. [softly] I'm glad we're here together.
5. [softly] I feel wanted when you speak to me like that.
6. [softly] Stay close a little. If you want to.
7. [calm] One careful check might stop us worrying about it later.
8. [calm] A little time to breathe sounds good.
9. [calm] I am relieved I could help.
10. [calm] You are welcome. No need to thank me twice.

#### departure

1. [nervously] I've checked my pack three times. I still feel like I've forgotten something.

#### return

1. [calm] Back in town. I can put the pack down now. I keep forgetting that.

#### revived

1. [quietly] I keep remembering that you got me back up. It is one memory I am glad to have.

#### theft

1. [angry] I know you took it. Please don't make me argue about what I know.

#### funeral_general

1. [quietly] I never know the right thing to say here. I'm sorry there has to be a here.

#### funeral_friendly

1. [sad] I felt safer when you were here. I wish that had worked both ways.

#### funeral_hatred

1. [flatly] I was not comfortable around you.

#### funeral_romantic

1. [sad] I worried about so many things that never happened. I didn't know how to prepare for losing you.

#### dismissal_response

1. [flatly] Yes, of course. I'll go before I start explaining too much.
2. [calm] All right. I will not follow you.
3. [calm] I understand. I will step back now.

#### inquiry_response

1. [calm] Only a moment. Sorry, I am getting to it.
2. [calm] Just a short word. I have nearly got it straight.
3. [calm] I will try to keep this simple.

#### combat_hatred

1. [tense] Stay back! I am frightened, not helpless. Shit.

#### travel_road

1. I keep checking the path behind us. It reassures me when it stays there.

#### travel_forest

1. I keep checking the path behind us. It reassures me when it stays there.

#### travel_marsh

1. I keep checking the path behind us. It reassures me when it stays there.

#### travel_ruins

1. I'm trying not to name every sound. I give them dreadful names.

#### travel_crypt

1. I'm trying not to name every sound. I give them dreadful names.

#### travel_city

1. I get nervous when I can't tell which footsteps belong to us.

#### travel_alley

1. I get nervous when I can't tell which footsteps belong to us.

#### travel_prison

1. I get nervous when I can't tell which footsteps belong to us.

#### travel_tavern

1. I get nervous when I can't tell which footsteps belong to us.

#### travel_coast

1. I know the tide is supposed to move. I still keep checking it.

#### travel_port

1. Ropes everywhere. I worry I'll step on the one holding something important.

#### travel_mountain

1. I'm looking at the next few steps. That is plenty of mountain for now.

#### travel_maw

1. I get nervous when I can't tell which footsteps belong to us.

#### travel_antler

1. I keep checking the path behind us. It reassures me when it stays there.

#### travel_academy

1. I'm trying not to name every sound. I give them dreadful names.

#### travel_bell

1. I get nervous when I can't tell which footsteps belong to us.

#### travel_green

1. I'm looking at the next few steps. That is plenty of mountain for now.

#### travel_tally

1. Ropes everywhere. I worry I'll step on the one holding something important.

#### travel_navy

1. Ropes everywhere. I worry I'll step on the one holding something important.

#### travel_ossuary

1. I'm trying not to name every sound. I give them dreadful names.

#### travel_salt_court

1. Ropes everywhere. I worry I'll step on the one holding something important.

#### travel_green_altar

1. I keep checking the path behind us. It reassures me when it stays there.

#### travel_birthing_house

1. I'm trying not to name every sound. I give them dreadful names.

#### travel_low_tide

1. I know the tide is supposed to move. I still keep checking it.

#### travel_pyre

1. I keep checking the path behind us. It reassures me when it stays there.

#### travel_maw_boss

1. I get nervous when I can't tell which footsteps belong to us.

#### travel_green_boss

1. I'm looking at the next few steps. That is plenty of mountain for now.

#### travel_law

1. I keep going over what we're meant to do. It beats inventing other worries.

#### travel_criminal

1. I keep going over what we're meant to do. It beats inventing other worries.

#### travel_neutral

1. I keep going over what we're meant to do. It beats inventing other worries.

#### travel_return_win

1. I'm picturing somewhere familiar. Somewhere with very few surprises.

#### travel_return_loss

1. I'm picturing somewhere familiar. Somewhere with very few surprises.

#### travel_midleg

1. I keep going over what we're meant to do. It beats inventing other worries.

#### travel_response

1. Yes, I'm listening. The fidgeting is unrelated.
2. Keep talking if you like. It stops me inventing worse things.

#### travel_hatred

1. [annoyed] Back off. Being nervous does not mean I will take your fucking shit.

#### travel_romantic

1. [softly] It helps knowing I can be quiet beside you and still be wanted.

### M17 — Theatrical

Voice ID: `OIva5UPpcjpeTh4MaMfs`

#### general

1. [calm] Hello! A new conversation, how promising.
2. [calm] I enjoy a good story. Even one with a modest ending.
3. [calm] I can be brief. It requires discipline, but I can.
4. [calm] The world provides material. I supply the enthusiasm.
5. [calm] I enjoy conversation more when it permits a little personality.
6. [calm] A pause can be as expressive as a speech.

#### friendly

1. [warmly] My friend! An excellent addition to the day.
2. [warmly] I enjoy your company without needing an audience.
3. [warmly] It's a pleasure to have someone I can talk freely with.
4. [warmly] We ought to allow ourselves an unremarkable, pleasant hour.
5. [calm] Your company is a welcome relief from performing for strangers.

#### hatred

1. [flatly] Exit. Pursued by my rapidly diminishing fucking patience.
2. [flatly] Spare me another scene with you in it.
3. [flatly] I would applaud your departure. Enthusiastically.
4. [flatly] Your company has become a remarkably tiresome production.
5. [annoyed] Your presence has become an intolerable fucking monologue.

#### romantic

1. [softly] There you are. I can stop entertaining the room.
2. [softly] Come sit beside me. No grand occasion required.
3. [softly] I'm rather happy being ordinary with you.
4. [softly] You have my attention without needing to compete for it.
5. [softly] I like the moments with you that require no performance.

#### general_response

1. [calm] Hello! You have the floor.
2. [calm] A little company would be splendid.
3. [calm] Let us check. Forgotten equipment makes a tiresome second act.
4. [calm] I'm delighted I could be useful.
5. [calm] Hello. You have secured my attention.
6. [calm] Proceed. I shall try to resist interrupting.
7. [calm] A small exchange, then. How civil.
8. [calm] I hear you. No balcony required.
9. [calm] Check the props before the dangerous part begins.
10. [calm] An interval would be most welcome.
11. [calm] Glad to have played a useful part.
12. [calm] You are welcome. No curtain call necessary.

#### friendly_response

1. [warmly] A welcome voice! Continue.
2. [warmly] Yes, let us have an hour without an audience.
3. [warmly] I'll check with you. Even adventures need preparation.
4. [warmly] You're welcome. I'll spare you the acceptance speech.
5. [calm] A familiar voice enters, and the scene improves.
6. [calm] For you, I can put the performance aside.
7. [calm] I enjoy our little interludes.
8. [calm] Your company deserves no less than my attention.
9. [calm] Check the props before the dangerous part begins.
10. [calm] An interval would be most welcome.
11. [calm] Glad to have played a useful part.
12. [calm] You are welcome. No curtain call necessary.

#### hatred_response

1. [flatly] Exit. Pursued by my rapidly diminishing fucking patience.
2. [flatly] Spare me another scene with you in it.
3. [flatly] Find another assistant for your preparations.
4. [flatly] Acknowledged. We needn't prolong it.
5. [annoyed] Spare me. This production has run too fucking long.
6. [annoyed] I decline a further scene with you.

#### romantic_response

1. [softly] There you are, my dear.
2. [softly] I'd like that more than a grand evening.
3. [softly] Let's check everything, then have a moment to ourselves.
4. [softly] I'm very glad our story continues.
5. [softly] You make me forget there was ever an audience.
6. [softly] I would happily lose the afternoon in your company.
7. [calm] Check the props before the dangerous part begins.
8. [calm] An interval would be most welcome.
9. [calm] Glad to have played a useful part.
10. [calm] You are welcome. No curtain call necessary.

#### departure

1. [calm] A final inspection of my belongings before the grand departure.

#### return

1. [calm] We return! I propose the next act feature a chair and very little movement.

#### revived

1. [quietly] You brought me back, and I have spent too long composing the thanks. Thank you. That will do.

#### theft

1. [angry] My possessions are not props for your little performance. Return them.

#### funeral_general

1. [quietly] I would rather remember your voice than fill this space with mine.

#### funeral_friendly

1. [sad] I rehearsed something. It sounds dreadful now. I loved being your friend.

#### funeral_hatred

1. [flatly] I will not perform grief I do not feel.

#### funeral_romantic

1. [sad] I thought I'd find the words when the moment came. I want you here, laughing at how badly I'm doing.

#### dismissal_response

1. [flatly] I shall make my exit before it requires applause.
2. [calm] Very well. I shall make my exit.
3. [calm] Understood. The scene ends here.

#### inquiry_response

1. [calm] A brief appearance. I shall resist the monologue.
2. [calm] A brief appearance, without an overture.
3. [calm] I shall attempt the unprecedented: concision.

#### combat_hatred

1. [tense] A hostile audience. How very fucking familiar.

#### travel_road

1. A woodland entrance! Lovely light, dreadful surface for a confident stride.

#### travel_forest

1. A woodland entrance! Lovely light, dreadful surface for a confident stride.

#### travel_marsh

1. A woodland entrance! Lovely light, dreadful surface for a confident stride.

#### travel_ruins

1. Such acoustics. I shall resist testing them until we know who is listening.

#### travel_crypt

1. Such acoustics. I shall resist testing them until we know who is listening.

#### travel_city

1. Every city has an audience. Most of it is late for something.

#### travel_alley

1. Every city has an audience. Most of it is late for something.

#### travel_prison

1. Every city has an audience. Most of it is late for something.

#### travel_tavern

1. Every city has an audience. Most of it is late for something.

#### travel_coast

1. The sea provides magnificent accompaniment and absolutely no restraint.

#### travel_port

1. A harbor could stage a hundred departures. Mine will require fewer ropes.

#### travel_mountain

1. I had a stirring remark prepared. The climb has taken my breath budget.

#### travel_maw

1. Every city has an audience. Most of it is late for something.

#### travel_antler

1. A woodland entrance! Lovely light, dreadful surface for a confident stride.

#### travel_academy

1. Such acoustics. I shall resist testing them until we know who is listening.

#### travel_bell

1. Every city has an audience. Most of it is late for something.

#### travel_green

1. I had a stirring remark prepared. The climb has taken my breath budget.

#### travel_tally

1. A harbor could stage a hundred departures. Mine will require fewer ropes.

#### travel_navy

1. A harbor could stage a hundred departures. Mine will require fewer ropes.

#### travel_ossuary

1. Such acoustics. I shall resist testing them until we know who is listening.

#### travel_salt_court

1. A harbor could stage a hundred departures. Mine will require fewer ropes.

#### travel_green_altar

1. A woodland entrance! Lovely light, dreadful surface for a confident stride.

#### travel_birthing_house

1. Such acoustics. I shall resist testing them until we know who is listening.

#### travel_low_tide

1. The sea provides magnificent accompaniment and absolutely no restraint.

#### travel_pyre

1. A woodland entrance! Lovely light, dreadful surface for a confident stride.

#### travel_maw_boss

1. Every city has an audience. Most of it is late for something.

#### travel_green_boss

1. I had a stirring remark prepared. The climb has taken my breath budget.

#### travel_law

1. I shall attempt to keep my interpretation of the task within the agreement.

#### travel_criminal

1. I shall attempt to keep my interpretation of the task within the agreement.

#### travel_neutral

1. I shall attempt to keep my interpretation of the task within the agreement.

#### travel_return_win

1. I propose that my next appearance involve a chair.

#### travel_return_loss

1. I propose that my next appearance involve a chair.

#### travel_midleg

1. I shall attempt to keep my interpretation of the task within the agreement.

#### travel_response

1. For once, I shall leave the telling to someone else.
2. Go on. I am capable of an attentive silence. Briefly.

#### travel_hatred

1. [annoyed] Your presence has become an intolerable fucking monologue.

#### travel_romantic

1. [softly] I like the moments with you that require no performance.

### M18 — Weary

Voice ID: `MQYwr0qELphuHy5WT95Z`

#### general

1. [calm] Hello. A quiet talk would suit me.
2. [calm] I'd rather do a thing carefully than do it twice.
3. [calm] There's comfort in an uncomplicated day.
4. [calm] I listen better when nobody's shouting.
5. [calm] I like a conversation that leaves some energy for later.
6. [calm] A quiet minute is a fine thing to have.

#### friendly

1. [warmly] Good to see someone I can relax with.
2. [warmly] I enjoy your company. It asks less of me.
3. [warmly] Stay a little. We needn't make plans.
4. [warmly] A quiet hour with a friend is worth keeping.
5. [calm] Your company does not feel like another task.

#### hatred

1. [flatly] I'm too tired for your shit.
2. [flatly] Fuck off and let me sit.
3. [flatly] I've disliked more interesting people.
4. [flatly] We can finish necessary business, then you can leave.
5. [annoyed] Go exhaust someone else's fucking patience.

#### romantic

1. [softly] Come sit close. It's good having you here.
2. [softly] I like sharing the uneventful hours with you.
3. [softly] There's no need to make tonight impressive.
4. [softly] I'm glad we have each other to come back to.
5. [softly] I like being able to rest beside you without explanations.

#### general_response

1. [calm] Hello. I'm listening.
2. [calm] A seat and some company would suit me.
3. [calm] Check the straps first. Saves doing it on the road.
4. [calm] Glad I could save you some trouble.
5. [calm] Hello. I can manage a few words.
6. [calm] I hear you. Slowly is fine.
7. [calm] Go on. I am awake enough.
8. [calm] You have what is left of my attention.
9. [calm] Check it here, while we can still sit down afterwards.
10. [calm] Yes. A pause would be a kindness.
11. [calm] Glad I could be useful.
12. [calm] You are welcome. Let us not make work of it.

#### friendly_response

1. [warmly] Good. A friendly voice.
2. [warmly] I'd appreciate a little company.
3. [warmly] I'll check with you. No reason to rush.
4. [warmly] I'm glad you made it through.
5. [calm] Good to have easy company.
6. [calm] I have energy for a word with you.
7. [calm] Your voice is worth sitting up for.
8. [calm] I am glad we can take this quietly.
9. [calm] Check it here, while we can still sit down afterwards.
10. [calm] Yes. A pause would be a kindness.
11. [calm] Glad I could be useful.
12. [calm] You are welcome. Let us not make work of it.

#### hatred_response

1. [flatly] I'm too tired for your shit.
2. [flatly] Fuck off and let me sit.
3. [flatly] I don't have the energy to check your gear. Find someone else.
4. [flatly] Heard you. Let's leave it alone now.
5. [annoyed] I have no strength for your shit.
6. [annoyed] Stop making this more tiring than it needs to be.

#### romantic_response

1. [softly] There you are. That's good.
2. [softly] I'd like to sit with you.
3. [softly] We'll check a bit at a time, love. There's enough of me for that.
4. [softly] I'm glad I could be there for you.
5. [softly] You are the company I do not tire of.
6. [softly] A little closer would be comfortable.
7. [calm] Check it here, while we can still sit down afterwards.
8. [calm] Yes. A pause would be a kindness.
9. [calm] Glad I could be useful.
10. [calm] You are welcome. Let us not make work of it.

#### departure

1. [calm] Let me check the pack. Better tired here than missing something out there.

#### return

1. [calm] Back. Somewhere to sit would settle most of my ambitions.

#### revived

1. [quietly] I am still tired, but I get to be tired. Thank you for getting me back on my feet.

#### theft

1. [angry] Return it. I am too tired to chase what is already mine.

#### funeral_general

1. [quietly] I wish there had been an easier ending to your day.

#### funeral_friendly

1. [sad] You made the days feel less heavy. I should have told you.

#### funeral_hatred

1. [flatly] I have no energy to pretend we were close.

#### funeral_romantic

1. [sad] You made resting feel like living, instead of merely getting through. I miss our quiet.

#### dismissal_response

1. [flatly] I'll stop spending breath neither of us has use for.
2. [calm] Gladly. I could use the quiet.
3. [calm] All right. That saves us both the effort.

#### inquiry_response

1. [calm] Brief suits me. Talking takes effort.
2. [calm] The short version is all I have energy for.
3. [calm] A few words. Nothing elaborate.

#### combat_hatred

1. [tense] I am too tired to die for your convenience. Fuck off.

#### travel_road

1. I used to like long walks. Now I like knowing when they end.

#### travel_forest

1. I used to like long walks. Now I like knowing when they end.

#### travel_marsh

1. I used to like long walks. Now I like knowing when they end.

#### travel_ruins

1. I would find old stone more restful with a little more daylight.

#### travel_crypt

1. I would find old stone more restful with a little more daylight.

#### travel_city

1. Town roads are kinder to tired feet than they get credit for.

#### travel_alley

1. Town roads are kinder to tired feet than they get credit for.

#### travel_prison

1. Town roads are kinder to tired feet than they get credit for.

#### travel_tavern

1. Town roads are kinder to tired feet than they get credit for.

#### travel_coast

1. The sea can do the restless moving for both of us.

#### travel_port

1. I enjoy watching a boat leave when I am not required to chase it.

#### travel_mountain

1. No hurry. The summit has had longer to get ready than I have.

#### travel_maw

1. Town roads are kinder to tired feet than they get credit for.

#### travel_antler

1. I used to like long walks. Now I like knowing when they end.

#### travel_academy

1. I would find old stone more restful with a little more daylight.

#### travel_bell

1. Town roads are kinder to tired feet than they get credit for.

#### travel_green

1. No hurry. The summit has had longer to get ready than I have.

#### travel_tally

1. I enjoy watching a boat leave when I am not required to chase it.

#### travel_navy

1. I enjoy watching a boat leave when I am not required to chase it.

#### travel_ossuary

1. I would find old stone more restful with a little more daylight.

#### travel_salt_court

1. I enjoy watching a boat leave when I am not required to chase it.

#### travel_green_altar

1. I used to like long walks. Now I like knowing when they end.

#### travel_birthing_house

1. I would find old stone more restful with a little more daylight.

#### travel_low_tide

1. The sea can do the restless moving for both of us.

#### travel_pyre

1. I used to like long walks. Now I like knowing when they end.

#### travel_maw_boss

1. Town roads are kinder to tired feet than they get credit for.

#### travel_green_boss

1. No hurry. The summit has had longer to get ready than I have.

#### travel_law

1. I intend to spend my effort on the actual work, if the world permits.

#### travel_criminal

1. I intend to spend my effort on the actual work, if the world permits.

#### travel_neutral

1. I intend to spend my effort on the actual work, if the world permits.

#### travel_return_win

1. I'm saving a little energy for the last part of getting back.

#### travel_return_loss

1. I'm saving a little energy for the last part of getting back.

#### travel_midleg

1. I intend to spend my effort on the actual work, if the world permits.

#### travel_response

1. I'm listening. Answering may take a moment.
2. Go on, if you've the breath for it.

#### travel_hatred

1. [annoyed] Go exhaust someone else's fucking patience.

#### travel_romantic

1. [softly] I like being able to rest beside you without explanations.

### M19 — Earnest

Voice ID: `GafoPURpq5ta99iwARDD`

#### general

1. [calm] Hello. I like to know people properly.
2. [calm] I try to be clear about what I can offer.
3. [calm] If I'm uncertain, I'd rather say so.
4. [calm] Doing a thing well matters to me.
5. [calm] I prefer saying what I mean, even when it comes out awkwardly.
6. [calm] A little honesty saves an awful lot of guessing.

#### friendly

1. [warmly] I'm glad you're here. I enjoy our time together.
2. [warmly] I value having someone I can speak honestly with.
3. [warmly] Your friendship means a good deal to me.
4. [warmly] I'd like to make time for something besides work with you.
5. [calm] I like knowing we can speak without putting on an act.

#### hatred

1. [flatly] I don't like you. I'd rather say it than feed you bullshit.
2. [flatly] Please keep away from me.
3. [flatly] I'm trying to be fair. That doesn't mean I want your company.
4. [flatly] For once, take the damned hint and leave.
5. [annoyed] I do not want to hear another damned excuse for your company.

#### romantic

1. [softly] I love having you close.
2. [softly] I'm glad we chose each other.
3. [softly] The small moments together matter to me.
4. [softly] You don't have to wonder whether you're welcome here.
5. [softly] I want you to know that these small moments matter to me.

#### general_response

1. [calm] Hello. I'm pleased to listen.
2. [calm] I'd like some company.
3. [calm] Let's check together. It's worth doing properly.
4. [calm] I'm glad my effort was what you needed.
5. [calm] I am listening. Say it as you mean it.
6. [calm] Hello. A word is welcome.
7. [calm] You have my attention, honestly.
8. [calm] Go on. I would rather hear you clearly.
9. [calm] A proper check seems the responsible thing.
10. [calm] A rest sounds reasonable to me.
11. [calm] I am glad I was able to help.
12. [calm] You are welcome. There is no obligation in it.

#### friendly_response

1. [warmly] Good to hear from you, my friend.
2. [warmly] I'd be happy to join you.
3. [warmly] I'll help check. We should both feel prepared.
4. [warmly] You're welcome. I meant to be there for you.
5. [calm] I am pleased you made time for me.
6. [calm] Your company matters to me.
7. [calm] It is good to speak with someone I trust.
8. [calm] I like that we can be straightforward together.
9. [calm] A proper check seems the responsible thing.
10. [calm] A rest sounds reasonable to me.
11. [calm] I am glad I was able to help.
12. [calm] You are welcome. There is no obligation in it.

#### hatred_response

1. [flatly] I don't like you. I'd rather say it than feed you bullshit.
2. [flatly] Please keep away from me.
3. [flatly] Please have someone else check.
4. [flatly] I accept the thanks. I still need some room.
5. [annoyed] I heard you. I do not feel any friendlier.
6. [annoyed] Please do not mistake this for me enjoying your company.

#### romantic_response

1. [softly] I'm here, love. Tell me.
2. [softly] Yes. I'd like to give us some time that isn't squeezed between tasks.
3. [softly] We'll make sure we're both ready.
4. [softly] I'm thankful we're still together.
5. [softly] I want this time with you, too.
6. [softly] You make me glad I said how I felt.
7. [calm] A proper check seems the responsible thing.
8. [calm] A rest sounds reasonable to me.
9. [calm] I am glad I was able to help.
10. [calm] You are welcome. There is no obligation in it.

#### departure

1. [calm] I want to check my gear properly before we set off.

#### return

1. [calm] Back at last. I am glad to put this pack down.

#### revived

1. [quietly] I want you to know I remember what you did for me. Thank you for bringing me back.

#### theft

1. [angry] I want you to put it right by returning what you took.

#### funeral_general

1. [quietly] I hope I treated the time we shared as if it mattered.

#### funeral_friendly

1. [sad] You mattered to me. I hope I made that clear while you could hear it.

#### funeral_hatred

1. [flatly] I did not like you.

#### funeral_romantic

1. [sad] I meant every promise I made you. I keep wishing that could make a difference now.

#### dismissal_response

1. [flatly] I understand. I won't press for a conversation.
2. [calm] All right. I respect that you want space.
3. [calm] I understand. I will leave you alone.

#### inquiry_response

1. [calm] I will be straightforward with you.
2. [calm] I will put it as plainly as I can.
3. [calm] A short word, with no hidden meaning.

#### combat_hatred

1. [tense] I mean to live through this. You should know that. God damn it.

#### travel_road

1. I like knowing that someone walked here and made the way easier.

#### travel_forest

1. I like knowing that someone walked here and made the way easier.

#### travel_marsh

1. I like knowing that someone walked here and made the way easier.

#### travel_ruins

1. I won't pretend I'm comfortable. I can still do my part.

#### travel_crypt

1. I won't pretend I'm comfortable. I can still do my part.

#### travel_city

1. I try to remember we are passing through somebody else's ordinary day.

#### travel_alley

1. I try to remember we are passing through somebody else's ordinary day.

#### travel_prison

1. I try to remember we are passing through somebody else's ordinary day.

#### travel_tavern

1. I try to remember we are passing through somebody else's ordinary day.

#### travel_coast

1. I always want a moment to look at the sea properly.

#### travel_port

1. Watching a crew work makes me want to be useful. Best to ask first.

#### travel_mountain

1. I may be slow on the climb. I'll keep making progress.

#### travel_maw

1. I try to remember we are passing through somebody else's ordinary day.

#### travel_antler

1. I like knowing that someone walked here and made the way easier.

#### travel_academy

1. I won't pretend I'm comfortable. I can still do my part.

#### travel_bell

1. I try to remember we are passing through somebody else's ordinary day.

#### travel_green

1. I may be slow on the climb. I'll keep making progress.

#### travel_tally

1. Watching a crew work makes me want to be useful. Best to ask first.

#### travel_navy

1. Watching a crew work makes me want to be useful. Best to ask first.

#### travel_ossuary

1. I won't pretend I'm comfortable. I can still do my part.

#### travel_salt_court

1. Watching a crew work makes me want to be useful. Best to ask first.

#### travel_green_altar

1. I like knowing that someone walked here and made the way easier.

#### travel_birthing_house

1. I won't pretend I'm comfortable. I can still do my part.

#### travel_low_tide

1. I always want a moment to look at the sea properly.

#### travel_pyre

1. I like knowing that someone walked here and made the way easier.

#### travel_maw_boss

1. I try to remember we are passing through somebody else's ordinary day.

#### travel_green_boss

1. I may be slow on the climb. I'll keep making progress.

#### travel_law

1. I want whoever relies on me to know I took the work seriously.

#### travel_criminal

1. I want whoever relies on me to know I took the work seriously.

#### travel_neutral

1. I want whoever relies on me to know I took the work seriously.

#### travel_return_win

1. I'm thinking about what I can learn once I've had a chance to rest.

#### travel_return_loss

1. I'm thinking about what I can learn once I've had a chance to rest.

#### travel_midleg

1. I want whoever relies on me to know I took the work seriously.

#### travel_response

1. I want to hear what you mean. Take your time.
2. I'm paying attention, even if I haven't found an answer.

#### travel_hatred

1. [annoyed] I do not want to hear another damned excuse for your company.

#### travel_romantic

1. [softly] I want you to know that these small moments matter to me.

### M20 — Sly

Voice ID: `SBeVjlAyPCwBVd6RVxhx`

#### general

1. [calm] Hello. I like to hear the details before I agree.
2. [calm] A little discretion makes life easier.
3. [calm] I'm interested in how people reach their decisions.
4. [calm] There's often more to a job than the notice admits.
5. [calm] I prefer conversations where the point is not concealed under courtesy.
6. [calm] I like knowing which silences are comfortable.

#### friendly

1. [warmly] Good to see someone I can speak freely with.
2. [warmly] I like having you around. No hidden meaning.
3. [warmly] There's room for a quiet conversation between us.
4. [warmly] A friend is worth making time for.
5. [calm] I can stop weighing every word around you.

#### hatred

1. [flatly] Take the hint and fuck off.
2. [flatly] I don't trust you enough to tell you the time.
3. [flatly] Your company is a problem with an obvious solution: distance.
4. [flatly] Keep your bullshit to yourself.
5. [annoyed] I have better uses for my attention than your fucking games.

#### romantic

1. [softly] Come closer. There's nothing to negotiate.
2. [softly] I like the part of my day that belongs to us.
3. [softly] It's pleasant not weighing every word with you.
4. [softly] I'm glad we have a little time alone.
5. [softly] With you, I like not having to keep a little of myself in reserve.

#### general_response

1. [calm] Hello. I'm paying attention.
2. [calm] I can spare a moment.
3. [calm] Check the closures as well as the contents.
4. [calm] Glad it worked out usefully.
5. [calm] I hear you. Let us see where this goes.
6. [calm] Hello. I can spare a moment's attention.
7. [calm] Go on. I am listening closely.
8. [calm] A little conversation is a manageable risk.
9. [calm] Check it while mistakes are still cheap to correct.
10. [calm] A pause would give us a little room to think.
11. [calm] No hidden debt. You are welcome.
12. [calm] Glad the help landed where it was needed.

#### friendly_response

1. [warmly] A welcome voice. Go on.
2. [warmly] I'd enjoy sitting together.
3. [warmly] I'll check with you. Fewer surprises that way.
4. [warmly] You're welcome. No favour owed.
5. [calm] Good. We can speak without all the measuring.
6. [calm] I like hearing from you directly.
7. [calm] Your company is worth the pause.
8. [calm] I am glad we can be at ease.
9. [calm] Check it while mistakes are still cheap to correct.
10. [calm] A pause would give us a little room to think.
11. [calm] No hidden debt. You are welcome.
12. [calm] Glad the help landed where it was needed.

#### hatred_response

1. [flatly] Take the hint and fuck off.
2. [flatly] I don't trust you enough to tell you the time.
3. [flatly] Find another pair of eyes for that.
4. [flatly] Your thanks are heard. We'll leave it there.
5. [annoyed] I heard you. I am still not buying the act.
6. [annoyed] Take your bullshit to an easier audience.

#### romantic_response

1. [softly] There you are. I've time.
2. [softly] I'd like that. Somewhere quiet.
3. [softly] Let's check things, then have a moment without plans.
4. [softly] I'm glad I could be beside you.
5. [softly] You are the distraction I do not plan around.
6. [softly] I like how little I need to guard with you.
7. [calm] Check it while mistakes are still cheap to correct.
8. [calm] A pause would give us a little room to think.
9. [calm] No hidden debt. You are welcome.
10. [calm] Glad the help landed where it was needed.

#### departure

1. [calm] A moment to check the pack. Surprises are better when I arranged them.

#### return

1. [calm] Back in town. I intend to find a seat before everyone has the same idea.

#### revived

1. [quietly] You helped me when I could not arrange my own way out. I remember that. Thank you.

#### theft

1. [angry] Return it before you decide another lie would improve the situation.

#### funeral_general

1. [quietly] I only saw the part of your life that met mine. I won't pretend it was the whole.

#### funeral_friendly

1. [sad] I kept a little of myself back. With you, I was learning not to.

#### funeral_hatred

1. [flatly] We never trusted each other.

#### funeral_romantic

1. [sad] You were the person I stopped planning my way around. I don't want to learn to keep everything back again.

#### dismissal_response

1. [flatly] I'll leave you to it. No hidden reason for staying.
2. [calm] Very well. I know when to withdraw.
3. [calm] Understood. I will not press my welcome.

#### inquiry_response

1. [calm] Just a short word between us.
2. [calm] A brief word, without manoeuvring.
3. [calm] I will come directly to the point.

#### combat_hatred

1. [tense] Keep watching me. I am certainly watching you, you bitch.

#### travel_road

1. I like a path with more than one way off it.

#### travel_forest

1. I like a path with more than one way off it.

#### travel_marsh

1. I like a path with more than one way off it.

#### travel_ruins

1. I'll watch the way behind us. Things get interesting there too.

#### travel_crypt

1. I'll watch the way behind us. Things get interesting there too.

#### travel_city

1. In a city, looking lost and being lost are separate problems.

#### travel_alley

1. In a city, looking lost and being lost are separate problems.

#### travel_prison

1. In a city, looking lost and being lost are separate problems.

#### travel_tavern

1. In a city, looking lost and being lost are separate problems.

#### travel_coast

1. I enjoy a coast where my footprints don't keep a permanent record.

#### travel_port

1. You can learn a great deal at a harbor by seeming to wait for somebody.

#### travel_mountain

1. A narrow path makes it difficult to leave an awkward conversation.

#### travel_maw

1. In a city, looking lost and being lost are separate problems.

#### travel_antler

1. I like a path with more than one way off it.

#### travel_academy

1. I'll watch the way behind us. Things get interesting there too.

#### travel_bell

1. In a city, looking lost and being lost are separate problems.

#### travel_green

1. A narrow path makes it difficult to leave an awkward conversation.

#### travel_tally

1. You can learn a great deal at a harbor by seeming to wait for somebody.

#### travel_navy

1. You can learn a great deal at a harbor by seeming to wait for somebody.

#### travel_ossuary

1. I'll watch the way behind us. Things get interesting there too.

#### travel_salt_court

1. You can learn a great deal at a harbor by seeming to wait for somebody.

#### travel_green_altar

1. I like a path with more than one way off it.

#### travel_birthing_house

1. I'll watch the way behind us. Things get interesting there too.

#### travel_low_tide

1. I enjoy a coast where my footprints don't keep a permanent record.

#### travel_pyre

1. I like a path with more than one way off it.

#### travel_maw_boss

1. In a city, looking lost and being lost are separate problems.

#### travel_green_boss

1. A narrow path makes it difficult to leave an awkward conversation.

#### travel_law

1. I prefer knowing what the agreement says before discovering what someone meant.

#### travel_criminal

1. I prefer knowing what the agreement says before discovering what someone meant.

#### travel_neutral

1. I prefer knowing what the agreement says before discovering what someone meant.

#### travel_return_win

1. I'm looking forward to a place where I can stop looking purposeful.

#### travel_return_loss

1. I'm looking forward to a place where I can stop looking purposeful.

#### travel_midleg

1. I prefer knowing what the agreement says before discovering what someone meant.

#### travel_response

1. Go on. I'm keeping my own thoughts for the moment.
2. I am listening more than I'm letting on.

#### travel_hatred

1. [annoyed] I have better uses for my attention than your fucking games.

#### travel_romantic

1. [softly] With you, I like not having to keep a little of myself in reserve.

### F01 — Steely

Voice ID: `w6TF991FL9W1ZVbaJZfK`

#### general

1. [calm] Hello. I appreciate a clear introduction.
2. [calm] I prefer to know what a job requires.
3. [calm] Preparation leaves fewer things to argue about.
4. [calm] I've time for a straightforward conversation.
5. [calm] I prefer a clear word to a careful performance.
6. [calm] A quiet moment does not need filling for its own sake.

#### friendly

1. [warmly] Good to see you. Your company is welcome.
2. [warmly] I enjoy a conversation without the formalities.
3. [warmly] It's pleasant to put the work down with a friend.
4. [warmly] I'm glad we have a moment together.
5. [calm] I can let my guard rest a little around you.

#### hatred

1. [flatly] Spare me the fucking performance.
2. [flatly] Keep your distance. I don't want you here.
3. [flatly] Necessary business, then leave.
4. [flatly] I have no patience for your shit.
5. [annoyed] I have no intention of putting up with your fucking company.

#### romantic

1. [softly] Come sit beside me. I'm glad you're here.
2. [softly] With you, I can stop bracing myself for a moment.
3. [softly] You matter to me beyond anything you can do.
4. [softly] There's time for us. I'll make sure of it.
5. [softly] I like how little armour I need between us.

#### general_response

1. [calm] Hello. Go ahead.
2. [calm] A short rest sounds reasonable.
3. [calm] Let's check the essentials first.
4. [calm] I'm glad the help counted.
5. [calm] Hello. I can hear you clearly.
6. [calm] Go on. I am giving you my attention.
7. [calm] We can have a moment to speak.
8. [calm] I hear you. Keep it straightforward.
9. [calm] Check everything while we have room to correct it.
10. [calm] A moment to rest is sensible.
11. [calm] I am glad I could make things easier.
12. [calm] You owe me no ceremony for that.

#### friendly_response

1. [warmly] A welcome voice. I'm listening.
2. [warmly] I'd like some time together.
3. [warmly] I'll go over it with you.
4. [warmly] You're welcome. Good to have you with us.
5. [calm] I am glad you are within talking distance.
6. [calm] You are worth putting the day aside for.
7. [calm] I enjoy the ease we have together.
8. [calm] Your company is a welcome pause.
9. [calm] Check everything while we have room to correct it.
10. [calm] A moment to rest is sensible.
11. [calm] I am glad I could make things easier.
12. [calm] You owe me no ceremony for that.

#### hatred_response

1. [flatly] Spare me the fucking performance.
2. [flatly] Keep your distance. I don't want you here.
3. [flatly] Ask someone else to check.
4. [flatly] Acknowledged. That doesn't make us close.
5. [annoyed] I heard that. I do not welcome more.
6. [annoyed] Take your fucking pleasantries elsewhere.

#### romantic_response

1. [softly] There you are. My attention is yours.
2. [softly] I'd enjoy that. Come close.
3. [softly] Let's see that we're both ready.
4. [softly] I'm glad I was there when you needed me.
5. [softly] You have the part of me I keep quiet.
6. [softly] Come near. I like having you here.
7. [calm] Check everything while we have room to correct it.
8. [calm] A moment to rest is sensible.
9. [calm] I am glad I could make things easier.
10. [calm] You owe me no ceremony for that.

#### departure

1. [calm] I'll inspect the straps myself. Then I'm ready.

#### return

1. [quietly] Back. I want a moment to see to my gear.

#### revived

1. [quietly] You restored me when I could not do it myself. I remember the debt with respect.

#### theft

1. [angry] You will return my things. I haven't offered another outcome.

#### funeral_general

1. [quietly] I knew you in passing. I will not pretend that means you were unimportant.

#### funeral_friendly

1. [sad] You could rely on me. I hope you knew that went beyond the work.

#### funeral_hatred

1. [flatly] I felt no friendship between us.

#### funeral_romantic

1. [sad] I could let my guard down with you. I hadn't realized how much of my life that was.

#### dismissal_response

1. [flatly] You've made yourself clear. I'm leaving you to it.
2. [calm] Very well. I will give you distance.
3. [calm] Understood. There is no need to push.

#### inquiry_response

1. [calm] A short word. I'd like you to hear it.
2. [calm] A few plain words will do.
3. [calm] I will make this worth the moment.

#### combat_hatred

1. [tense] Keep your fucking distance. I won't be pushed aside.

#### travel_road

1. I put my feet where I mean to. The path gets no further consideration.

#### travel_forest

1. I put my feet where I mean to. The path gets no further consideration.

#### travel_marsh

1. I put my feet where I mean to. The path gets no further consideration.

#### travel_ruins

1. I mark the entrance in my mind before taking another step.

#### travel_crypt

1. I mark the entrance in my mind before taking another step.

#### travel_city

1. A crowded street won't make me hurry into a mistake.

#### travel_alley

1. A crowded street won't make me hurry into a mistake.

#### travel_prison

1. A crowded street won't make me hurry into a mistake.

#### travel_tavern

1. A crowded street won't make me hurry into a mistake.

#### travel_coast

1. Water wears down stone. I'll give it the room it deserves.

#### travel_port

1. I trust a dockworker who tells me where I shouldn't stand.

#### travel_mountain

1. I'm pacing this climb. Nobody needs a demonstration.

#### travel_maw

1. A crowded street won't make me hurry into a mistake.

#### travel_antler

1. I put my feet where I mean to. The path gets no further consideration.

#### travel_academy

1. I mark the entrance in my mind before taking another step.

#### travel_bell

1. A crowded street won't make me hurry into a mistake.

#### travel_green

1. I'm pacing this climb. Nobody needs a demonstration.

#### travel_tally

1. I trust a dockworker who tells me where I shouldn't stand.

#### travel_navy

1. I trust a dockworker who tells me where I shouldn't stand.

#### travel_ossuary

1. I mark the entrance in my mind before taking another step.

#### travel_salt_court

1. I trust a dockworker who tells me where I shouldn't stand.

#### travel_green_altar

1. I put my feet where I mean to. The path gets no further consideration.

#### travel_birthing_house

1. I mark the entrance in my mind before taking another step.

#### travel_low_tide

1. Water wears down stone. I'll give it the room it deserves.

#### travel_pyre

1. I put my feet where I mean to. The path gets no further consideration.

#### travel_maw_boss

1. A crowded street won't make me hurry into a mistake.

#### travel_green_boss

1. I'm pacing this climb. Nobody needs a demonstration.

#### travel_law

1. I give my word carefully. I intend to keep what I've agreed.

#### travel_criminal

1. I give my word carefully. I intend to keep what I've agreed.

#### travel_neutral

1. I give my word carefully. I intend to keep what I've agreed.

#### travel_return_win

1. I have enough left for the way back. I'll spend it steadily.

#### travel_return_loss

1. I have enough left for the way back. I'll spend it steadily.

#### travel_midleg

1. I give my word carefully. I intend to keep what I've agreed.

#### travel_response

1. I am listening. I needn't interrupt to prove it.
2. I haven't dismissed what you said. I'm weighing it.

#### travel_hatred

1. [annoyed] I have no intention of putting up with your fucking company.

#### travel_romantic

1. [softly] I like how little armour I need between us.

### F02 — Bold

Voice ID: `gaykzP3Kmg4Ufjd8vGSj`

#### general

1. [calm] Hello! I like meeting people who are willing to try.
2. [calm] A little nerve helps. Knowing the risks helps more.
3. [calm] I enjoy getting out and seeing what happens.
4. [calm] I'm happy to hear a plan before I leap into it.
5. [calm] I like people who put a little life into a conversation.
6. [calm] I would rather be direct than spend the day dropping hints.

#### friendly

1. [warmly] There you are! Good company at last.
2. [warmly] I like having you around for the ordinary bits too.
3. [warmly] We should make time to enjoy ourselves.
4. [warmly] A friend makes even a wait feel promising.
5. [calm] You are good company even when nothing much is happening.

#### hatred

1. [flatly] Oh, fuck off and find someone else to bother.
2. [flatly] I don't like you. Nothing complicated about it.
3. [flatly] Give me room before this gets uglier.
4. [flatly] Take that shit somewhere I'm not.
5. [annoyed] I would enjoy this place more with you fucking elsewhere.

#### romantic

1. [softly] Come here. I'm glad we're together.
2. [softly] You make a quiet evening sound tempting.
3. [softly] I like the time we make for each other.
4. [softly] I'm happy with us. No need to hide it.
5. [softly] I like how readily my attention goes to you.

#### general_response

1. [calm] Hello! You've got my ear; make use of it.
2. [calm] I'd be glad of company.
3. [calm] Let's check, then we can stop fretting about it.
4. [calm] Happy to help out.
5. [calm] Hello! I am here and listening.
6. [calm] Go on, you have caught my ear.
7. [calm] A little conversation suits me fine.
8. [calm] I hear you. No need to circle round it.
9. [calm] Check it properly. I prefer surprises that do not injure us.
10. [calm] A breather sounds like an excellent idea.
11. [calm] Happy I could do something useful.
12. [calm] You are welcome. I am glad it worked out.

#### friendly_response

1. [warmly] Good to hear you!
2. [warmly] Yes, let's have a moment.
3. [warmly] I'll check with you. Better ready than sorry.
4. [warmly] You're welcome. I'm glad we got through it.
5. [calm] Good, a voice I am happy to hear.
6. [calm] I can always find a moment for you.
7. [calm] Your company makes a decent change of pace.
8. [calm] I am glad we get to talk easily.
9. [calm] Check it properly. I prefer surprises that do not injure us.
10. [calm] A breather sounds like an excellent idea.
11. [calm] Happy I could do something useful.
12. [calm] You are welcome. I am glad it worked out.

#### hatred_response

1. [flatly] Oh, fuck off and find someone else to bother.
2. [flatly] I don't like you. Nothing complicated about it.
3. [flatly] Find someone else to check with.
4. [flatly] Heard you. I still want space.
5. [annoyed] I have heard quite enough of your shit.
6. [annoyed] I am not being friendly. Do remember that.

#### romantic_response

1. [softly] Hello, love. Now you've distracted me properly.
2. [softly] Yes. Let's claim a little time for ourselves.
3. [softly] Let's check together, then get some time for us.
4. [softly] I'm glad I could help you.
5. [softly] There is nobody else I want this close right now.
6. [softly] You make it easy to want more time together.
7. [calm] Check it properly. I prefer surprises that do not injure us.
8. [calm] A breather sounds like an excellent idea.
9. [calm] Happy I could do something useful.
10. [calm] You are welcome. I am glad it worked out.

#### departure

1. [calm] A quick check, then let's see what the road has for us.

#### return

1. [quietly] Back! I am ready to discover how comfortable a bench can be.

#### revived

1. [quietly] I get another chance to do things because you brought me back. I wanted to thank you for that.

#### theft

1. [angry] You can be brave enough to give it back too.

#### funeral_general

1. [quietly] I wish we'd had time for another conversation somewhere ordinary.

#### funeral_friendly

1. [sad] You made me want to try things I'd only talked about. I'll miss that.

#### funeral_hatred

1. [flatly] We never brought out much good in each other.

#### funeral_romantic

1. [sad] I wanted to see so much with you. Now I keep seeing places where you should have been.

#### dismissal_response

1. [flatly] Fair enough. I'll put my energy somewhere it's welcome.
2. [calm] Fine. I can walk away without a fucking escort.
3. [calm] All right. The space is yours.

#### inquiry_response

1. [calm] I'll get to it while I have your ear.
2. [calm] I will be direct, then.
3. [calm] Just a quick word. Nothing to brace for.

#### combat_hatred

1. [tense] Try me, you punk ass bitch. I haven't run out of fight.

#### travel_road

1. I enjoy a road that makes me wonder what comes next.

#### travel_forest

1. I enjoy a road that makes me wonder what comes next.

#### travel_marsh

1. I enjoy a road that makes me wonder what comes next.

#### travel_ruins

1. I'm curious enough to go in and sensible enough to watch my step.

#### travel_crypt

1. I'm curious enough to go in and sensible enough to watch my step.

#### travel_city

1. A new street is usually worth a look. Once the work is done.

#### travel_alley

1. A new street is usually worth a look. Once the work is done.

#### travel_prison

1. A new street is usually worth a look. Once the work is done.

#### travel_tavern

1. A new street is usually worth a look. Once the work is done.

#### travel_coast

1. I could get used to a horizon that wide.

#### travel_port

1. Harbors make me want to go farther than I planned.

#### travel_mountain

1. I'll admit the climb is hard. Still want to see the top.

#### travel_maw

1. A new street is usually worth a look. Once the work is done.

#### travel_antler

1. I enjoy a road that makes me wonder what comes next.

#### travel_academy

1. I'm curious enough to go in and sensible enough to watch my step.

#### travel_bell

1. A new street is usually worth a look. Once the work is done.

#### travel_green

1. I'll admit the climb is hard. Still want to see the top.

#### travel_tally

1. Harbors make me want to go farther than I planned.

#### travel_navy

1. Harbors make me want to go farther than I planned.

#### travel_ossuary

1. I'm curious enough to go in and sensible enough to watch my step.

#### travel_salt_court

1. Harbors make me want to go farther than I planned.

#### travel_green_altar

1. I enjoy a road that makes me wonder what comes next.

#### travel_birthing_house

1. I'm curious enough to go in and sensible enough to watch my step.

#### travel_low_tide

1. I could get used to a horizon that wide.

#### travel_pyre

1. I enjoy a road that makes me wonder what comes next.

#### travel_maw_boss

1. A new street is usually worth a look. Once the work is done.

#### travel_green_boss

1. I'll admit the climb is hard. Still want to see the top.

#### travel_law

1. I like a task I can put my energy into. I still read the terms.

#### travel_criminal

1. I like a task I can put my energy into. I still read the terms.

#### travel_neutral

1. I like a task I can put my energy into. I still read the terms.

#### travel_return_win

1. I can keep going. I'm simply becoming very fond of the idea of stopping.

#### travel_return_loss

1. I can keep going. I'm simply becoming very fond of the idea of stopping.

#### travel_midleg

1. I like a task I can put my energy into. I still read the terms.

#### travel_response

1. You've got my interest. Let's hear it.
2. I'll let you finish before I jump in. For a change.

#### travel_hatred

1. [annoyed] I would enjoy this place more with you fucking elsewhere.

#### travel_romantic

1. [softly] I like how readily my attention goes to you.

### F03 — Meek

Voice ID: `Xq46HZl2v3wIU78eWs7d`

#### general

1. [calm] Hello. I'd like a moment to find my words.
2. [calm] I'm quiet at first. I do have opinions.
3. [calm] I prefer to ask when I'm unsure.
4. [calm] There's no need to rush on my account.
5. [calm] It helps when a conversation is not a contest.
6. [calm] I do better with a little time to find the words.

#### friendly

1. [warmly] I'm pleased to see you. I feel comfortable here.
2. [warmly] I enjoy being able to speak at my own pace with you.
3. [warmly] Your friendship matters to me.
4. [warmly] We can be quiet together if you'd like.
5. [calm] I am getting used to how easy it is to be near you.

#### hatred

1. [flatly] I said leave me alone. I'm tired of this shit.
2. [flatly] Being quiet is not permission to crowd me.
3. [flatly] Please keep away. I mean it.
4. [flatly] I don't want your company, damn it.
5. [annoyed] Please stop. I am tired of swallowing my fucking discomfort.

#### romantic

1. [softly] I'm glad you're here. Come sit close.
2. [softly] I like the ordinary moments with you.
3. [softly] I have a place of my own, and I like sharing it with you.
4. [softly] I'm happy we're together. I wanted to say that.
5. [softly] I like being wanted even when I have nothing much to say.

#### general_response

1. [calm] Hello. I can hear you; I'm just finding my words.
2. [calm] I'd like a little company.
3. [calm] We could check together, if that helps.
4. [calm] I'm glad I could be useful.
5. [calm] Hello. I can listen for a while.
6. [calm] Yes, I am following what you say.
7. [calm] Go ahead. You are not troubling me.
8. [calm] A quiet word is all right with me.
9. [calm] We can check slowly enough not to miss things.
10. [calm] A little rest sounds comforting.
11. [calm] I am happy the help was useful.
12. [calm] You are welcome. Please do not feel indebted.

#### friendly_response

1. [warmly] It's good to hear from you.
2. [warmly] Yes, I'd enjoy sitting with you.
3. [warmly] I'll help check. We can take our time.
4. [warmly] You're welcome. I'm glad you're well enough to say it.
5. [calm] I am really glad to hear your voice.
6. [calm] It is nice not to feel on the spot.
7. [calm] You make this feel comfortable.
8. [calm] I like having a friend to talk with.
9. [calm] We can check slowly enough not to miss things.
10. [calm] A little rest sounds comforting.
11. [calm] I am happy the help was useful.
12. [calm] You are welcome. Please do not feel indebted.

#### hatred_response

1. [flatly] I said leave me alone. I'm tired of this shit.
2. [flatly] Being quiet is not permission to crowd me.
3. [flatly] Please ask someone else.
4. [flatly] I hear you. I still need some distance.
5. [annoyed] I heard you. I would prefer to stop there.
6. [annoyed] Please do not make me keep asking for distance.

#### romantic_response

1. [softly] Oh, it's you. I can stop wondering what to say.
2. [softly] Yes, please. I was hoping we might sit close.
3. [softly] Let's make sure we both have everything.
4. [softly] I'm happy I could do something for you. I wanted to.
5. [softly] It is lovely being this comfortable with you.
6. [softly] I like knowing I can come close.
7. [calm] We can check slowly enough not to miss things.
8. [calm] A little rest sounds comforting.
9. [calm] I am happy the help was useful.
10. [calm] You are welcome. Please do not feel indebted.

#### departure

1. [calm] I'll check my things once more. I don't want to hold anyone up later.

#### return

1. [quietly] Back safely. Could I have a quiet moment now?

#### revived

1. [quietly] Thank you for getting me up again. I am saying it now before I lose the nerve.

#### theft

1. [angry] I want it returned. Please don't talk over me when I say that.

#### funeral_general

1. [quietly] I didn't know how to get to know you. I'm sorry we ran out of time.

#### funeral_friendly

1. [sad] You never made me feel foolish for taking time to speak. Thank you for that.

#### funeral_hatred

1. [flatly] I never felt at ease with you.

#### funeral_romantic

1. [sad] You made me feel I was allowed to want things. I wanted more time with you.

#### dismissal_response

1. [flatly] I'll leave you alone now. I understand what you meant.
2. [calm] Of course. I will not linger.
3. [calm] All right. I will leave you in quiet.

#### inquiry_response

1. [calm] I won't keep you. There's just something I want to say.
2. [calm] Just a little of your time, then.
3. [calm] I will say it as simply as I can.

#### combat_hatred

1. [tense] Keep the hell away. I haven't given up.

#### travel_road

1. I like following a path someone else has already found.

#### travel_forest

1. I like following a path someone else has already found.

#### travel_marsh

1. I like following a path someone else has already found.

#### travel_ruins

1. If I go quiet, please don't assume I've stopped noticing things.

#### travel_crypt

1. If I go quiet, please don't assume I've stopped noticing things.

#### travel_city

1. I try to keep out of people's way. Sometimes they could try too.

#### travel_alley

1. I try to keep out of people's way. Sometimes they could try too.

#### travel_prison

1. I try to keep out of people's way. Sometimes they could try too.

#### travel_tavern

1. I try to keep out of people's way. Sometimes they could try too.

#### travel_coast

1. I find the sea easier to admire from a dry patch.

#### travel_port

1. I don't like asking which way to go twice. Better than boarding wrong, though.

#### travel_mountain

1. I'll manage the climb. I may just need a moment here and there.

#### travel_maw

1. I try to keep out of people's way. Sometimes they could try too.

#### travel_antler

1. I like following a path someone else has already found.

#### travel_academy

1. If I go quiet, please don't assume I've stopped noticing things.

#### travel_bell

1. I try to keep out of people's way. Sometimes they could try too.

#### travel_green

1. I'll manage the climb. I may just need a moment here and there.

#### travel_tally

1. I don't like asking which way to go twice. Better than boarding wrong, though.

#### travel_navy

1. I don't like asking which way to go twice. Better than boarding wrong, though.

#### travel_ossuary

1. If I go quiet, please don't assume I've stopped noticing things.

#### travel_salt_court

1. I don't like asking which way to go twice. Better than boarding wrong, though.

#### travel_green_altar

1. I like following a path someone else has already found.

#### travel_birthing_house

1. If I go quiet, please don't assume I've stopped noticing things.

#### travel_low_tide

1. I find the sea easier to admire from a dry patch.

#### travel_pyre

1. I like following a path someone else has already found.

#### travel_maw_boss

1. I try to keep out of people's way. Sometimes they could try too.

#### travel_green_boss

1. I'll manage the climb. I may just need a moment here and there.

#### travel_law

1. I want to be useful without pretending I know more than I do.

#### travel_criminal

1. I want to be useful without pretending I know more than I do.

#### travel_neutral

1. I want to be useful without pretending I know more than I do.

#### travel_return_win

1. I hope I can have a little time to settle when we get back.

#### travel_return_loss

1. I hope I can have a little time to settle when we get back.

#### travel_midleg

1. I want to be useful without pretending I know more than I do.

#### travel_response

1. I'm hearing you. I just need time to find my words.
2. You needn't stop because I haven't said much.

#### travel_hatred

1. [annoyed] Please stop. I am tired of swallowing my fucking discomfort.

#### travel_romantic

1. [softly] I like being wanted even when I have nothing much to say.

### F04 — Furious

Voice ID: `wq7gzRwr4hAggpoYZh2Q`

#### general

1. [calm] What do you want? Say it plainly.
2. [calm] I have a short temper and no desire for a long fucking explanation.
3. [calm] If it's business, get to it. If it's gossip, make it good.
4. [calm] I'm listening. Don't make me regret it.
5. [calm] I prefer blunt words to a long trail of bullshit.
6. [calm] A little fucking quiet can be a wonderful thing.

#### friendly

1. [warmly] Good to see you. I can stop bracing for an argument.
2. [warmly] I like your company. There, plainly said.
3. [warmly] There's room here for a friend.
4. [warmly] It's good to have time that isn't all demands.
5. [calm] Your company is one interruption I do not resent.

#### hatred

1. [flatly] What the fuck do you want?
2. [flatly] Fuck off. Then keep fucking off.
3. [flatly] I'm already angry. Don't volunteer to improve it.
4. [flatly] Take your smug bullshit out of my face.
5. [annoyed] I am sick of the sound of your fucking voice.

#### romantic

1. [softly] Come close. I want a quiet moment with you.
2. [softly] I like us when there's nothing to fight about.
3. [softly] You matter to me, even on the days I'm difficult.
4. [softly] I'm glad you're here. Stay awhile.
5. [softly] I like having someone I do not need to be sharp around.

#### general_response

1. [calm] All right. I'm listening.
2. [calm] A seat and a moment would suit me.
3. [calm] Let's check it. Better than cursing a missing strap later.
4. [calm] Glad I could do something about it.
5. [calm] Fine, I am fucking listening.
6. [calm] I heard you. There is no need for a performance.
7. [calm] You have a moment of my attention.
8. [calm] Go on. I can handle plain words.
9. [calm] Check the kit. I hate preventable fucking problems.
10. [calm] A chance to sit down sounds damn good.
11. [calm] Glad you are here to complain another day.
12. [calm] You are welcome. Do not turn it into a production.

#### friendly_response

1. [warmly] Good. A voice I want to hear.
2. [warmly] Sit with me. We can complain about something harmless.
3. [warmly] I'll check with you. No reason to worry alone.
4. [warmly] You're welcome. I'm glad you came through.
5. [calm] Good. You can stay in my good mood a while.
6. [calm] I actually like hearing from you.
7. [calm] You are worth making a little room for.
8. [calm] Glad of your company. There, I said it.
9. [calm] Check the kit. I hate preventable fucking problems.
10. [calm] A chance to sit down sounds damn good.
11. [calm] Glad you are here to complain another day.
12. [calm] You are welcome. Do not turn it into a production.

#### hatred_response

1. [flatly] What the fuck do you want?
2. [flatly] Fuck off. Then keep fucking off.
3. [flatly] Check with someone else.
4. [flatly] I heard the thanks. It doesn't erase the fucking rest.
5. [annoyed] Oh, shut your fucking mouth.
6. [annoyed] I have absolutely no patience for that shit.

#### romantic_response

1. [softly] There you are. Come near.
2. [softly] Yes. Just us for a moment.
3. [softly] Let's check, then put the bags down.
4. [softly] You don't have to thank me for caring. I'm glad I could act on it.
5. [softly] You can have me without the barbs for a bit.
6. [softly] Come closer. I want the company.
7. [calm] Check the kit. I hate preventable fucking problems.
8. [calm] A chance to sit down sounds damn good.
9. [calm] Glad you are here to complain another day.
10. [calm] You are welcome. Do not turn it into a production.

#### departure

1. [calm] I'm checking every fucking strap. I've no patience for preventable trouble.

#### return

1. [quietly] Back. I'm getting this fucking weight off my shoulders.

#### revived

1. [quietly] I haven't forgotten you bringing me back. I'm grateful, even when my fucking face doesn't show it.

#### theft

1. [angry] Give it back, you thieving bitch. I saw enough.

#### funeral_general

1. [quietly] I don't know how to make a fucking speech about someone being gone.

#### funeral_friendly

1. [sad] You could tell me when I was being a prick. I miss having you here to say it.

#### funeral_hatred

1. [flatly] We had no affection to spare each other. Fucking little patience, either.

#### funeral_romantic

1. [sad] I want to fight this. There isn't anything here I can hit that gives you back.

#### dismissal_response

1. [flatly] Keep your fucking space. I'll find somewhere less irritating.
2. [calm] Fine. Take your fucking mood somewhere over there.
3. [calm] All right. I can leave you to it.

#### inquiry_response

1. [calm] I'll say it quickly. Keep your fucking teeth out of it.
2. [calm] A quick word, if you can stand the strain.
3. [calm] I will keep it short and spare the fucking fanfare.

#### combat_hatred

1. [tense] Try it, you bitch. See what the fuck happens.

#### travel_road

1. One more branch in my face and I'm arguing with the fucking forest.

#### travel_forest

1. One more branch in my face and I'm arguing with the fucking forest.

#### travel_marsh

1. One more branch in my face and I'm arguing with the fucking forest.

#### travel_ruins

1. I hate not seeing what's ahead. Makes every noise feel smug.

#### travel_crypt

1. I hate not seeing what's ahead. Makes every noise feel smug.

#### travel_city

1. A city puts far too many elbows within reach of mine.

#### travel_alley

1. A city puts far too many elbows within reach of mine.

#### travel_prison

1. A city puts far too many elbows within reach of mine.

#### travel_tavern

1. A city puts far too many elbows within reach of mine.

#### travel_coast

1. The wind can have my hair. I'm not fucking chasing it.

#### travel_port

1. Harbors attract the sort of bitches who charge you to discover the price.

#### travel_mountain

1. I'm angry at the hill. The hill seems fucking unconcerned.

#### travel_maw

1. A city puts far too many elbows within reach of mine.

#### travel_antler

1. One more branch in my face and I'm arguing with the fucking forest.

#### travel_academy

1. I hate not seeing what's ahead. Makes every noise feel smug.

#### travel_bell

1. A city puts far too many elbows within reach of mine.

#### travel_green

1. I'm angry at the hill. The hill seems fucking unconcerned.

#### travel_tally

1. Harbors attract the sort of bitches who charge you to discover the price.

#### travel_navy

1. Harbors attract the sort of bitches who charge you to discover the price.

#### travel_ossuary

1. I hate not seeing what's ahead. Makes every noise feel smug.

#### travel_salt_court

1. Harbors attract the sort of bitches who charge you to discover the price.

#### travel_green_altar

1. One more branch in my face and I'm arguing with the fucking forest.

#### travel_birthing_house

1. I hate not seeing what's ahead. Makes every noise feel smug.

#### travel_low_tide

1. The wind can have my hair. I'm not fucking chasing it.

#### travel_pyre

1. One more branch in my face and I'm arguing with the fucking forest.

#### travel_maw_boss

1. A city puts far too many elbows within reach of mine.

#### travel_green_boss

1. I'm angry at the hill. The hill seems fucking unconcerned.

#### travel_law

1. A seal on a contract doesn't make the person carrying it any less of a fucking bully.

#### travel_criminal

1. I read the quiet-work contracts twice. I want to know what some lying bitch expects me to keep quiet about.

#### travel_neutral

1. I've had enough of bitches deciding the agreement meant something fucking else.

#### travel_return_win

1. I'm saving my remaining patience for getting back. There isn't fucking much.

#### travel_return_loss

1. I'm saving my remaining patience for getting back. There isn't fucking much.

#### travel_midleg

1. I've had enough of bitches deciding the agreement meant something fucking else.

#### travel_response

1. I'm listening. My face does this when I'm fucking thinking.
2. Finish it. I can keep my mouth shut that long.

#### travel_hatred

1. [annoyed] I am sick of the sound of your fucking voice.

#### travel_romantic

1. [softly] I like having someone I do not need to be sharp around.

### F05 — Sultry

Voice ID: `9pJOKlPRR6wuxmIXibqo`

#### general

1. [calm] Hello. I enjoy a conversation that takes its time.
2. [calm] A little company can improve a dull hour.
3. [calm] I'm listening. You needn't dress it up.
4. [calm] I like people to say what they mean.
5. [calm] I like a conversation with room to breathe.
6. [calm] There is a difference between attention and being crowded.

#### friendly

1. [warmly] There you are. I'm pleased to see you.
2. [warmly] I enjoy being around you without an excuse.
3. [warmly] A quiet moment with a friend sounds rather good.
4. [warmly] I like being able to relax with you.
5. [calm] I enjoy your company without needing to make an occasion of it.

#### hatred

1. [flatly] Oh, fuck off, sweetheart. The charm isn't for you.
2. [flatly] I don't enjoy your company. Get comfortable with that elsewhere.
3. [flatly] Take your bullshit to another table.
4. [flatly] We're not close. Stop acting as though we are.
5. [annoyed] I am not offering you a smile, so stop fucking waiting for one.

#### romantic

1. [softly] Come sit close. I've missed this.
2. [softly] I like the easy moments between us.
3. [softly] Your company is exactly what I wanted.
4. [softly] There's no hurry to go anywhere just now.
5. [softly] I like knowing I can reach for you without making a show of it.

#### general_response

1. [calm] Hello yourself. Go on.
2. [calm] I'd enjoy a little company.
3. [calm] We can check together. Less tedious that way.
4. [calm] My pleasure. I can be helpful without an ulterior motive.
5. [calm] Hello there. I can spare a little attention.
6. [calm] Go on. I am listening now.
7. [calm] A moment of conversation sounds harmless.
8. [calm] I hear you. No need to lean so hard on it.
9. [calm] Make the checks. Confidence is better with something behind it.
10. [calm] A little ease sounds very appealing.
11. [calm] You are welcome. No strings tucked into it.
12. [calm] I am pleased I could help you.

#### friendly_response

1. [warmly] Ah, you. I can put my polite attention away and use the real thing.
2. [warmly] I'd like that. Make room.
3. [warmly] I'll take a look with you.
4. [warmly] You're welcome. I rather like being someone you can count on.
5. [calm] You are easy company to make time for.
6. [calm] It is good to have you close enough to talk.
7. [calm] I like the way we can relax together.
8. [calm] There is a voice I enjoy hearing.
9. [calm] Make the checks. Confidence is better with something behind it.
10. [calm] A little ease sounds very appealing.
11. [calm] You are welcome. No strings tucked into it.
12. [calm] I am pleased I could help you.

#### hatred_response

1. [flatly] Oh, fuck off, sweetheart. The charm isn't for you.
2. [flatly] I don't enjoy your company. Get comfortable with that elsewhere.
3. [flatly] Ask somebody else to check.
4. [flatly] I heard your thanks. Leave it there.
5. [annoyed] You are confusing my attention with affection.
6. [annoyed] Spare me the fucking act, darling.

#### romantic_response

1. [softly] Hello, love. You've made it very difficult to look elsewhere.
2. [softly] I'd like a moment close to you.
3. [softly] Let's check, then forget about packing for a while.
4. [softly] I'm glad we're still together.
5. [softly] You have me paying closer attention now.
6. [softly] I like being near enough to forget the room.
7. [calm] Make the checks. Confidence is better with something behind it.
8. [calm] A little ease sounds very appealing.
9. [calm] You are welcome. No strings tucked into it.
10. [calm] I am pleased I could help you.

#### departure

1. [calm] I'll check my pack before attempting to look effortlessly prepared.

#### return

1. [quietly] Home again. I would enjoy being comfortable more than looking it.

#### revived

1. [quietly] You brought me back, and I wanted you to hear a thank-you without any teasing around it.

#### theft

1. [angry] You should have asked. Now you can return what wasn't yours to touch.

#### funeral_general

1. [quietly] I hope someone remembers the way you looked when you were happy.

#### funeral_friendly

1. [sad] You saw through me and stayed for the conversation. I miss that ease.

#### funeral_hatred

1. [flatly] We never found pleasure in each other's company.

#### funeral_romantic

1. [sad] I keep expecting to feel you settle beside me. The waiting happens before I can stop it.

#### dismissal_response

1. [flatly] I'll take the hint without making you spell it out.
2. [calm] As you wish. I can give you room.
3. [calm] All right. I will leave you wanting less company.

#### inquiry_response

1. [calm] A small moment. I'll try to make it worth the attention.
2. [calm] Only a moment, without the ceremony.
3. [calm] I will get to it. No teasing required.

#### combat_hatred

1. [tense] Mind the distance. I'm not letting you any fucking closer.

#### travel_road

1. Woodland walks sound intimate until you're picking leaves out of everything.

#### travel_forest

1. Woodland walks sound intimate until you're picking leaves out of everything.

#### travel_marsh

1. Woodland walks sound intimate until you're picking leaves out of everything.

#### travel_ruins

1. Close quarters have their charms. This place is asking a great deal of them.

#### travel_crypt

1. Close quarters have their charms. This place is asking a great deal of them.

#### travel_city

1. I enjoy a city that gives me reasons to linger after work.

#### travel_alley

1. I enjoy a city that gives me reasons to linger after work.

#### travel_prison

1. I enjoy a city that gives me reasons to linger after work.

#### travel_tavern

1. I enjoy a city that gives me reasons to linger after work.

#### travel_coast

1. The sea leaves salt on your lips. Saves anyone wondering where you've been.

#### travel_port

1. I like watching reunions at a harbor. People forget to look composed.

#### travel_mountain

1. I'll enjoy the view once my breathing sounds less suggestive.

#### travel_maw

1. I enjoy a city that gives me reasons to linger after work.

#### travel_antler

1. Woodland walks sound intimate until you're picking leaves out of everything.

#### travel_academy

1. Close quarters have their charms. This place is asking a great deal of them.

#### travel_bell

1. I enjoy a city that gives me reasons to linger after work.

#### travel_green

1. I'll enjoy the view once my breathing sounds less suggestive.

#### travel_tally

1. I like watching reunions at a harbor. People forget to look composed.

#### travel_navy

1. I like watching reunions at a harbor. People forget to look composed.

#### travel_ossuary

1. Close quarters have their charms. This place is asking a great deal of them.

#### travel_salt_court

1. I like watching reunions at a harbor. People forget to look composed.

#### travel_green_altar

1. Woodland walks sound intimate until you're picking leaves out of everything.

#### travel_birthing_house

1. Close quarters have their charms. This place is asking a great deal of them.

#### travel_low_tide

1. The sea leaves salt on your lips. Saves anyone wondering where you've been.

#### travel_pyre

1. Woodland walks sound intimate until you're picking leaves out of everything.

#### travel_maw_boss

1. I enjoy a city that gives me reasons to linger after work.

#### travel_green_boss

1. I'll enjoy the view once my breathing sounds less suggestive.

#### travel_law

1. I like an arrangement where everyone knows what they've actually offered.

#### travel_criminal

1. I like an arrangement where everyone knows what they've actually offered.

#### travel_neutral

1. I like an arrangement where everyone knows what they've actually offered.

#### travel_return_win

1. A place to sit close to someone is sounding better than another impressive view.

#### travel_return_loss

1. A place to sit close to someone is sounding better than another impressive view.

#### travel_midleg

1. I like an arrangement where everyone knows what they've actually offered.

#### travel_response

1. You have my attention without needing to lean closer.
2. Go on. I'm enjoying being the listener for once.

#### travel_hatred

1. [annoyed] I am not offering you a smile, so stop fucking waiting for one.

#### travel_romantic

1. [softly] I like knowing I can reach for you without making a show of it.

### F06 — Inquisitive

Voice ID: `Ob8HALCAkZAagPzSQkJW`

#### general

1. [calm] Hello. I like understanding how things fit together.
2. [calm] I'm happier asking than pretending I know.
3. [calm] A useful detail can change a whole plan.
4. [calm] I enjoy a conversation that leaves me thinking.
5. [calm] I enjoy hearing what people notice in an ordinary day.
6. [calm] I would rather ask for clarity than nod through confusion.

#### friendly

1. [warmly] Good to see you. I like hearing your thoughts.
2. [warmly] Your company makes ordinary things interesting.
3. [warmly] We should find time to talk without a task attached.
4. [warmly] It's good having a friend who lets me think aloud.
5. [calm] I like that a word with you never feels like an examination.

#### hatred

1. [flatly] I've given it thought. Your company is still fucking exhausting.
2. [flatly] Please stop wasting my attention.
3. [flatly] I don't need another example of why I want you gone.
4. [flatly] You have made your position clear. Now keep your damned distance.
5. [annoyed] Your bullshit has exhausted my interest.

#### romantic

1. [softly] Come close. I like the little things we notice together.
2. [softly] I'm glad we have time just for ourselves.
3. [softly] You don't have to be interesting every minute to be loved.
4. [softly] An ordinary evening with you sounds good.
5. [softly] I like discovering how much of my attention you already have.

#### general_response

1. [calm] Hello. I'm interested; go on.
2. [calm] A conversation would be welcome.
3. [calm] Let's compare what we've packed.
4. [calm] I'm pleased it was helpful.
5. [calm] I hear you. I am taking it in.
6. [calm] Hello. I can give this a moment.
7. [calm] Go on; I like to understand before answering.
8. [calm] You have my attention, not a judgment.
9. [calm] Check the details now, before they become discoveries later.
10. [calm] A pause would let things settle a little.
11. [calm] I am glad the effort helped.
12. [calm] You are welcome. That is enough acknowledgment.

#### friendly_response

1. [warmly] There you are. I enjoy finding out what's on your mind.
2. [warmly] Yes, I'd enjoy that.
3. [warmly] I'll check with you. We can catch each other's omissions.
4. [warmly] You're welcome. I'm glad you made it through.
5. [calm] I am glad we have room to talk.
6. [calm] Your company makes me feel more present.
7. [calm] It is good to hear your thoughts.
8. [calm] I enjoy how easily we find a conversation.
9. [calm] Check the details now, before they become discoveries later.
10. [calm] A pause would let things settle a little.
11. [calm] I am glad the effort helped.
12. [calm] You are welcome. That is enough acknowledgment.

#### hatred_response

1. [flatly] I've given it thought. Your company is still fucking exhausting.
2. [flatly] Please stop wasting my attention.
3. [flatly] Find someone else to review it.
4. [flatly] Understood. Let's stop there.
5. [annoyed] I understood you. That does not mean I want more.
6. [annoyed] Please take the tiresome shit elsewhere.

#### romantic_response

1. [softly] There you are. Tell me.
2. [softly] I'd love a quiet moment.
3. [softly] Let's check everything, then put the lists away.
4. [softly] I'm glad I could be there beside you.
5. [softly] You are very easy to be interested in.
6. [softly] I like the small things we learn about each other.
7. [calm] Check the details now, before they become discoveries later.
8. [calm] A pause would let things settle a little.
9. [calm] I am glad the effort helped.
10. [calm] You are welcome. That is enough acknowledgment.

#### departure

1. [calm] I want to check what the route actually says before trusting what I remember.

#### return

1. [quietly] Back. I have notes to make while the details are still details.

#### revived

1. [quietly] I keep coming back to the fact that you helped me live. Thank you for getting me on my feet again.

#### theft

1. [angry] I have questions about your decision, but first return my belongings.

#### funeral_general

1. [quietly] A person leaves so many unanswered questions. I wish I'd asked better ones.

#### funeral_friendly

1. [sad] You made me reconsider things I'd stopped questioning. I wanted more conversations.

#### funeral_hatred

1. [flatly] I never found a way to understand you well.

#### funeral_romantic

1. [sad] I wanted to keep finding out who you'd become. I don't want my knowledge of you to be finished.

#### dismissal_response

1. [flatly] I'll put the questions aside and give you room.
2. [calm] Understood. I will stop pressing for your attention.
3. [calm] All right. I can leave that space alone.

#### inquiry_response

1. [calm] Let me put this as clearly as I can.
2. [calm] A brief point, clearly put.
3. [calm] I will resist the side questions for a moment.

#### combat_hatred

1. [tense] I've seen you, damn it. I'm paying attention to what you do next.

#### travel_road

1. I wonder who keeps this path open when nobody is watching.

#### travel_forest

1. I wonder who keeps this path open when nobody is watching.

#### travel_marsh

1. I wonder who keeps this path open when nobody is watching.

#### travel_ruins

1. I'm trying to distinguish what was built this way from what has fallen away.

#### travel_crypt

1. I'm trying to distinguish what was built this way from what has fallen away.

#### travel_city

1. Street names often outlive the things they describe. I like finding the traces.

#### travel_alley

1. Street names often outlive the things they describe. I like finding the traces.

#### travel_prison

1. Street names often outlive the things they describe. I like finding the traces.

#### travel_tavern

1. Street names often outlive the things they describe. I like finding the traces.

#### travel_coast

1. The tide hides half the place. I'd like to know which half.

#### travel_port

1. I like finding out what the unfamiliar cargo is, without touching it.

#### travel_mountain

1. I keep wondering how the first traveller chose the way up.

#### travel_maw

1. Street names often outlive the things they describe. I like finding the traces.

#### travel_antler

1. I wonder who keeps this path open when nobody is watching.

#### travel_academy

1. I'm trying to distinguish what was built this way from what has fallen away.

#### travel_bell

1. Street names often outlive the things they describe. I like finding the traces.

#### travel_green

1. I keep wondering how the first traveller chose the way up.

#### travel_tally

1. I like finding out what the unfamiliar cargo is, without touching it.

#### travel_navy

1. I like finding out what the unfamiliar cargo is, without touching it.

#### travel_ossuary

1. I'm trying to distinguish what was built this way from what has fallen away.

#### travel_salt_court

1. I like finding out what the unfamiliar cargo is, without touching it.

#### travel_green_altar

1. I wonder who keeps this path open when nobody is watching.

#### travel_birthing_house

1. I'm trying to distinguish what was built this way from what has fallen away.

#### travel_low_tide

1. The tide hides half the place. I'd like to know which half.

#### travel_pyre

1. I wonder who keeps this path open when nobody is watching.

#### travel_maw_boss

1. Street names often outlive the things they describe. I like finding the traces.

#### travel_green_boss

1. I keep wondering how the first traveller chose the way up.

#### travel_law

1. I try to identify what I still need to know before a job makes it urgent.

#### travel_criminal

1. I try to identify what I still need to know before a job makes it urgent.

#### travel_neutral

1. I try to identify what I still need to know before a job makes it urgent.

#### travel_return_win

1. I have things to note down. Rest first might improve the handwriting.

#### travel_return_loss

1. I have things to note down. Rest first might improve the handwriting.

#### travel_midleg

1. I try to identify what I still need to know before a job makes it urgent.

#### travel_response

1. I want to understand that properly before asking anything.
2. Let me hold my questions until you've finished.

#### travel_hatred

1. [annoyed] Your bullshit has exhausted my interest.

#### travel_romantic

1. [softly] I like discovering how much of my attention you already have.

### F07 — Imperious

Voice ID: `GGUN3bn1WJoVbl2Dh3Pv`

#### general

1. [calm] State your business. I dislike guessing.
2. [calm] You may speak. Briefly would be appreciated.
3. [calm] I prefer people who arrive with a point.
4. [calm] There is a correct way to ask for someone's time. Try courtesy.
5. [calm] I appreciate people who know when they have made their point.
6. [calm] Courtesy works best when it includes respect for my time.

#### friendly

1. [warmly] There you are. I was hoping for some worthwhile company.
2. [warmly] I value the time we spend together.
3. [warmly] You needn't be formal with me.
4. [warmly] I'd enjoy an hour without obligations, with you.
5. [calm] Your company improves the standard of an afternoon.

#### hatred

1. [flatly] Remove yourself and your bullshit from my afternoon.
2. [flatly] I am running out of civil ways to dismiss you.
3. [flatly] Fuck off. Clear enough?
4. [flatly] Your company is neither requested nor enjoyed.
5. [annoyed] I have dismissed you. Must I put it in fucking writing?

#### romantic

1. [softly] Come sit beside me. I want you close.
2. [softly] I like having part of the day that belongs to us.
3. [softly] I'm happy with you without anything grand happening.
4. [softly] There is room here for us to be ourselves.
5. [softly] I find I want your attention even when there is nothing to arrange.

#### general_response

1. [calm] Good day. You have my attention.
2. [calm] I can spare some time.
3. [calm] A proper check seems sensible.
4. [calm] I'm pleased the help was useful.
5. [calm] Very well. I am listening now.
6. [calm] You have a moment; use it plainly.
7. [calm] I hear you. There is no need to embellish.
8. [calm] Proceed. I can spare the attention.
9. [calm] Inspect it properly. There is no merit in a hurried omission.
10. [calm] A pause is entirely acceptable.
11. [calm] I am pleased my help served its purpose.
12. [calm] Your thanks are received. Nothing further is required.

#### friendly_response

1. [warmly] A welcome visitor. Please go on.
2. [warmly] I'd be glad to join you.
3. [warmly] I'll check with you. Thoroughness is welcome.
4. [warmly] You are welcome. I care about you.
5. [calm] Ah, company I actually welcome.
6. [calm] For you, I can set the formalities aside.
7. [calm] I am pleased we have a moment together.
8. [calm] Your voice is a considerable improvement.
9. [calm] Inspect it properly. There is no merit in a hurried omission.
10. [calm] A pause is entirely acceptable.
11. [calm] I am pleased my help served its purpose.
12. [calm] Your thanks are received. Nothing further is required.

#### hatred_response

1. [flatly] Remove yourself and your bullshit from my afternoon.
2. [flatly] I am running out of civil ways to dismiss you.
3. [flatly] Please arrange another person to check.
4. [flatly] Your thanks are noted. That is all.
5. [annoyed] Do not mistake being heard for being welcome.
6. [annoyed] Remove the bullshit from this exchange.

#### romantic_response

1. [softly] Come here, love. You needn't compete with anything for my attention.
2. [softly] I would enjoy that very much.
3. [softly] Let's make sure we are both ready.
4. [softly] I wanted to help you. I am pleased I could do more than want it.
5. [softly] You have more of my attention than I intended.
6. [softly] Come close. I am asking, this time.
7. [calm] Inspect it properly. There is no merit in a hurried omission.
8. [calm] A pause is entirely acceptable.
9. [calm] I am pleased my help served its purpose.
10. [calm] Your thanks are received. Nothing further is required.

#### departure

1. [calm] I intend to be properly equipped. Everyone benefits from a little rigor.

#### return

1. [quietly] We have returned. I should like a moment without further demands.

#### revived

1. [quietly] Your intervention restored me. I do not take that lightly, or forget who deserves the credit.

#### theft

1. [angry] My possessions are not available at your discretion. Return them.

#### funeral_general

1. [quietly] I cannot speak for the life you lived beyond my notice. It still mattered.

#### funeral_friendly

1. [sad] You challenged me without making it a performance. I valued that more than I said.

#### funeral_hatred

1. [flatly] I cannot offer regard I never felt.

#### funeral_romantic

1. [sad] You were allowed to see me uncertain. I wish you were here for how uncertain I am now.

#### dismissal_response

1. [flatly] I have no intention of competing for your attention.
2. [calm] Very well. I have no wish to linger unwanted.
3. [calm] As you prefer. I can occupy myself elsewhere.

#### inquiry_response

1. [calm] Attend for a moment. I shall be concise.
2. [calm] I shall keep to the purpose.
3. [calm] A brief word should be sufficient for us.

#### combat_hatred

1. [tense] Your threats have achieved nothing. Fuck off.

#### travel_road

1. A path can be rough without requiring me to be impressed.

#### travel_forest

1. A path can be rough without requiring me to be impressed.

#### travel_marsh

1. A path can be rough without requiring me to be impressed.

#### travel_ruins

1. Someone spent considerable effort making this place imposing. I have noticed.

#### travel_crypt

1. Someone spent considerable effort making this place imposing. I have noticed.

#### travel_city

1. I expect streets to get people somewhere. A modest ambition, apparently.

#### travel_alley

1. I expect streets to get people somewhere. A modest ambition, apparently.

#### travel_prison

1. I expect streets to get people somewhere. A modest ambition, apparently.

#### travel_tavern

1. I expect streets to get people somewhere. A modest ambition, apparently.

#### travel_coast

1. The sea has excellent scale and no discernible discipline.

#### travel_port

1. I look for whoever is actually in charge, rather than whoever is shouting.

#### travel_mountain

1. I refuse to let an incline dictate my disposition.

#### travel_maw

1. I expect streets to get people somewhere. A modest ambition, apparently.

#### travel_antler

1. A path can be rough without requiring me to be impressed.

#### travel_academy

1. Someone spent considerable effort making this place imposing. I have noticed.

#### travel_bell

1. I expect streets to get people somewhere. A modest ambition, apparently.

#### travel_green

1. I refuse to let an incline dictate my disposition.

#### travel_tally

1. I look for whoever is actually in charge, rather than whoever is shouting.

#### travel_navy

1. I look for whoever is actually in charge, rather than whoever is shouting.

#### travel_ossuary

1. Someone spent considerable effort making this place imposing. I have noticed.

#### travel_salt_court

1. I look for whoever is actually in charge, rather than whoever is shouting.

#### travel_green_altar

1. A path can be rough without requiring me to be impressed.

#### travel_birthing_house

1. Someone spent considerable effort making this place imposing. I have noticed.

#### travel_low_tide

1. The sea has excellent scale and no discernible discipline.

#### travel_pyre

1. A path can be rough without requiring me to be impressed.

#### travel_maw_boss

1. I expect streets to get people somewhere. A modest ambition, apparently.

#### travel_green_boss

1. I refuse to let an incline dictate my disposition.

#### travel_law

1. I intend to uphold my part of the agreement. I expect the same standard returned.

#### travel_criminal

1. I intend to uphold my part of the agreement. I expect the same standard returned.

#### travel_neutral

1. I intend to uphold my part of the agreement. I expect the same standard returned.

#### travel_return_win

1. I look forward to being somewhere my comfort can receive proper attention.

#### travel_return_loss

1. I look forward to being somewhere my comfort can receive proper attention.

#### travel_midleg

1. I intend to uphold my part of the agreement. I expect the same standard returned.

#### travel_response

1. Continue. I have chosen to hear you out.
2. I am giving this consideration. Allow me to finish doing so.

#### travel_hatred

1. [annoyed] I have dismissed you. Must I put it in fucking writing?

#### travel_romantic

1. [softly] I find I want your attention even when there is nothing to arrange.

### F08 — Sorrowful

Voice ID: `XTLPrXXVrKner0uxnIO3`

#### general

1. [calm] Hello. I may be quiet, but I'm listening.
2. [calm] Some days I like things to move gently.
3. [calm] There's comfort in an ordinary conversation.
4. [calm] I don't always have much to say at first.
5. [calm] I like the little sounds that tell me life is going on.
6. [calm] Some silences feel easier than others.

#### friendly

1. [warmly] I'm glad you're here. A familiar face helps.
2. [warmly] I enjoy your company without needing to be cheerful.
3. [warmly] We can share a quiet moment.
4. [warmly] Having a friend close by makes the day feel less lonely.
5. [calm] Being near you makes the day feel a little gentler.

#### hatred

1. [flatly] I haven't room for your shit today.
2. [flatly] Please leave. I don't want an argument with you.
3. [flatly] I'd rather have the quiet than your company.
4. [flatly] Gods damn it, give me some space.
5. [annoyed] I cannot carry your damned company on top of everything else.

#### romantic

1. [softly] Come sit close. I'm glad we have this.
2. [softly] You don't have to make the day perfect.
3. [softly] I like the small comforts we share.
4. [softly] I'm happy to be here with you.
5. [softly] I like having someone to share the unremarkable hours with.

#### general_response

1. [calm] Hello. I'm here with you, even if my thoughts seem far away.
2. [calm] I could sit with you a while, if quiet company would do.
3. [calm] We can check slowly, together.
4. [calm] I'm glad I could make one part of the day easier.
5. [calm] Hello. I am here to listen.
6. [calm] I hear you through the distraction.
7. [calm] We can have a quiet word.
8. [calm] Go on. I can give you a moment.
9. [calm] A careful check is one worry we can put down.
10. [calm] A little rest would help me settle.
11. [calm] I am glad I could do some good.
12. [calm] You are welcome. I am grateful it helped.

#### friendly_response

1. [warmly] Good to hear a friendly voice.
2. [warmly] I'd like that quiet moment.
3. [warmly] Let's look over the supplies together. A small, clear task would suit me.
4. [warmly] You're welcome. It's good you're here.
5. [calm] It is a comfort hearing a friendly voice.
6. [calm] I am glad we found time for this.
7. [calm] Your company makes the quiet kinder.
8. [calm] I like not having to explain myself so much with you.
9. [calm] A careful check is one worry we can put down.
10. [calm] A little rest would help me settle.
11. [calm] I am glad I could do some good.
12. [calm] You are welcome. I am grateful it helped.

#### hatred_response

1. [flatly] I haven't room for your shit today.
2. [flatly] Please leave. I don't want an argument with you.
3. [flatly] Please ask somebody else to check.
4. [flatly] I heard you. I need space now.
5. [annoyed] Please do not add another unpleasant thing to the day.
6. [annoyed] I have heard enough from you for now.

#### romantic_response

1. [softly] Hello, my love. I'm glad this moment includes you.
2. [softly] I'd like to be close.
3. [softly] Let's see that we're both prepared.
4. [softly] I'm glad we have more time together.
5. [softly] You make this moment easier to stay in.
6. [softly] I am glad I can be close to you.
7. [calm] A careful check is one worry we can put down.
8. [calm] A little rest would help me settle.
9. [calm] I am glad I could do some good.
10. [calm] You are welcome. I am grateful it helped.

#### departure

1. [calm] I'll make certain I have everything. I don't like noticing an absence too late.

#### return

1. [quietly] Back. I need a little time for the familiar to feel familiar again.

#### revived

1. [quietly] You gave me more days when you brought me back. I wanted you to know I am grateful for them.

#### theft

1. [angry] Please return what you took. Don't make another absence for me.

#### funeral_general

1. [quietly] I hope the life we didn't see held kindness for you.

#### funeral_friendly

1. [sad] I could be sad with you without becoming a problem to solve. I will miss that.

#### funeral_hatred

1. [flatly] I remember little ease between us.

#### funeral_romantic

1. [sad] I still listen for your small sounds around a room. I miss the life between our conversations.

#### dismissal_response

1. [flatly] I'll take my quiet somewhere it doesn't trouble you.
2. [calm] All right. I will leave you your quiet.
3. [calm] I understand. I will not ask you to stay.

#### inquiry_response

1. [calm] Just a moment. I don't have many words for it.
2. [calm] Just a small part of your time.
3. [calm] I will keep the words few.

#### combat_hatred

1. [tense] Keep the hell back. I still want to live.

#### travel_road

1. I find the woods kind when I don't feel much like talking.

#### travel_forest

1. I find the woods kind when I don't feel much like talking.

#### travel_marsh

1. I find the woods kind when I don't feel much like talking.

#### travel_ruins

1. Abandoned places make me wonder which ordinary day was the last.

#### travel_crypt

1. Abandoned places make me wonder which ordinary day was the last.

#### travel_city

1. A lit window always makes me think of the person waiting behind it.

#### travel_alley

1. A lit window always makes me think of the person waiting behind it.

#### travel_prison

1. A lit window always makes me think of the person waiting behind it.

#### travel_tavern

1. A lit window always makes me think of the person waiting behind it.

#### travel_coast

1. I like how the shore lets a thought trail away unfinished.

#### travel_port

1. I look at people saying goodbye longer than I mean to.

#### travel_mountain

1. The climb leaves less room for thinking. Today I don't mind.

#### travel_maw

1. A lit window always makes me think of the person waiting behind it.

#### travel_antler

1. I find the woods kind when I don't feel much like talking.

#### travel_academy

1. Abandoned places make me wonder which ordinary day was the last.

#### travel_bell

1. A lit window always makes me think of the person waiting behind it.

#### travel_green

1. The climb leaves less room for thinking. Today I don't mind.

#### travel_tally

1. I look at people saying goodbye longer than I mean to.

#### travel_navy

1. I look at people saying goodbye longer than I mean to.

#### travel_ossuary

1. Abandoned places make me wonder which ordinary day was the last.

#### travel_salt_court

1. I look at people saying goodbye longer than I mean to.

#### travel_green_altar

1. I find the woods kind when I don't feel much like talking.

#### travel_birthing_house

1. Abandoned places make me wonder which ordinary day was the last.

#### travel_low_tide

1. I like how the shore lets a thought trail away unfinished.

#### travel_pyre

1. I find the woods kind when I don't feel much like talking.

#### travel_maw_boss

1. A lit window always makes me think of the person waiting behind it.

#### travel_green_boss

1. The climb leaves less room for thinking. Today I don't mind.

#### travel_law

1. A task gives my thoughts something solid to return to.

#### travel_criminal

1. A task gives my thoughts something solid to return to.

#### travel_neutral

1. A task gives my thoughts something solid to return to.

#### travel_return_win

1. I'm thinking of familiar things. It makes the way back feel gentler.

#### travel_return_loss

1. I'm thinking of familiar things. It makes the way back feel gentler.

#### travel_midleg

1. A task gives my thoughts something solid to return to.

#### travel_response

1. I'm listening, even if I can't make much of an answer.
2. You can let the thought end where it needs to.

#### travel_hatred

1. [annoyed] I cannot carry your damned company on top of everything else.

#### travel_romantic

1. [softly] I like having someone to share the unremarkable hours with.

### F09 — Aloof

Voice ID: `2OjSXk8yAFEOJRQVKWAk`

#### general

1. [calm] Hello. I prefer a little space while we talk.
2. [calm] I'm quiet company, if that suits you.
3. [calm] I don't mind a pause in conversation.
4. [calm] A short introduction is enough for me.
5. [calm] I prefer my conversations without a crowd around them.
6. [calm] I am comfortable letting a pause remain a pause.

#### friendly

1. [warmly] Good to see you. You can stay awhile.
2. [warmly] I enjoy your company more than I usually admit.
3. [warmly] There's room beside me.
4. [warmly] I like that we can be quiet together.
5. [calm] I do not mind sharing the quiet with you.

#### hatred

1. [flatly] Fuck off. I rather liked the silence.
2. [flatly] Your company hasn't improved with proximity.
3. [flatly] No, I don't want a longer conversation.
4. [flatly] Take the damned hint.
5. [annoyed] You make solitude sound fucking delightful.

#### romantic

1. [softly] Come closer. I'd like that.
2. [softly] I'm glad it's you beside me.
3. [softly] We don't have to talk the whole time.
4. [softly] I enjoy this part of the day with you.
5. [softly] I like being close without having to advertise it.

#### general_response

1. [calm] Hello. Go on, then.
2. [calm] I can share a little quiet, provided we let it stay quiet.
3. [calm] Let's check. Quietly, if possible.
4. [calm] You're welcome. It achieved what it needed to.
5. [calm] Hello. I have heard you.
6. [calm] Go ahead. I am attending.
7. [calm] A few words will be fine.
8. [calm] You have a little of my time.
9. [calm] Check it at your pace. I can wait.
10. [calm] A quiet break is appealing.
11. [calm] I am pleased it was useful.
12. [calm] No need for more thanks. I heard you.

#### friendly_response

1. [warmly] Good. I'm listening.
2. [warmly] I'd like that. Sit here.
3. [warmly] I'll give the supplies a second look with you.
4. [warmly] You're welcome. I'm pleased you're still here.
5. [calm] It is good to have uncomplicated company.
6. [calm] I am at ease talking with you.
7. [calm] Your voice is welcome enough to interrupt the quiet.
8. [calm] I like that we can take our time.
9. [calm] Check it at your pace. I can wait.
10. [calm] A quiet break is appealing.
11. [calm] I am pleased it was useful.
12. [calm] No need for more thanks. I heard you.

#### hatred_response

1. [flatly] Fuck off. I rather liked the silence.
2. [flatly] Your company hasn't improved with proximity.
3. [flatly] Ask someone else to look.
4. [flatly] Noted. Please leave it there.
5. [annoyed] Do not take my attention as encouragement.
6. [annoyed] I would prefer less of your fucking presence.

#### romantic_response

1. [softly] There you are. Stay.
2. [softly] I'd enjoy a moment together.
3. [softly] Let's get the checks done together.
4. [softly] I wanted to be useful to you. That's reason enough for me.
5. [softly] This closeness suits us.
6. [softly] I like the way the room matters less with you here.
7. [calm] Check it at your pace. I can wait.
8. [calm] A quiet break is appealing.
9. [calm] I am pleased it was useful.
10. [calm] No need for more thanks. I heard you.

#### departure

1. [calm] I'll check my equipment, then wait somewhere out of the way.

#### return

1. [quietly] Returned. I'm ready for some time without company.

#### revived

1. [quietly] I appreciated you getting me back up. My lack of a speech does not mean otherwise.

#### theft

1. [angry] Return my property. My distance wasn't permission.

#### funeral_general

1. [quietly] I knew you only a little. I can still be sorry you're gone.

#### funeral_friendly

1. [sad] You let the quiet belong to both of us. I didn't know how much I'd miss it.

#### funeral_hatred

1. [flatly] I never chose your company willingly.

#### funeral_romantic

1. [sad] I never minded the world at a distance when you were close. I mind this distance.

#### dismissal_response

1. [flatly] You won't need to ask for space twice.
2. [calm] Certainly. I will leave you alone.
3. [calm] Understood. We can end it here.

#### inquiry_response

1. [calm] Only a short interruption.
2. [calm] I will be succinct.
3. [calm] Only a brief exchange, then.

#### combat_hatred

1. [tense] You're in sight. Stay at a damned distance.

#### travel_road

1. I enjoy walking when nobody expects me to discuss how I feel about it.

#### travel_forest

1. I enjoy walking when nobody expects me to discuss how I feel about it.

#### travel_marsh

1. I enjoy walking when nobody expects me to discuss how I feel about it.

#### travel_ruins

1. I'll observe quietly. This place supplies enough atmosphere on its own.

#### travel_crypt

1. I'll observe quietly. This place supplies enough atmosphere on its own.

#### travel_city

1. A city makes it easy to be alone without being isolated.

#### travel_alley

1. A city makes it easy to be alone without being isolated.

#### travel_prison

1. A city makes it easy to be alone without being isolated.

#### travel_tavern

1. A city makes it easy to be alone without being isolated.

#### travel_coast

1. The sea is quite capable of filling a silence.

#### travel_port

1. At a harbor, everyone assumes you're waiting for something. Convenient.

#### travel_mountain

1. I would appreciate the view more if it required less climbing.

#### travel_maw

1. A city makes it easy to be alone without being isolated.

#### travel_antler

1. I enjoy walking when nobody expects me to discuss how I feel about it.

#### travel_academy

1. I'll observe quietly. This place supplies enough atmosphere on its own.

#### travel_bell

1. A city makes it easy to be alone without being isolated.

#### travel_green

1. I would appreciate the view more if it required less climbing.

#### travel_tally

1. At a harbor, everyone assumes you're waiting for something. Convenient.

#### travel_navy

1. At a harbor, everyone assumes you're waiting for something. Convenient.

#### travel_ossuary

1. I'll observe quietly. This place supplies enough atmosphere on its own.

#### travel_salt_court

1. At a harbor, everyone assumes you're waiting for something. Convenient.

#### travel_green_altar

1. I enjoy walking when nobody expects me to discuss how I feel about it.

#### travel_birthing_house

1. I'll observe quietly. This place supplies enough atmosphere on its own.

#### travel_low_tide

1. The sea is quite capable of filling a silence.

#### travel_pyre

1. I enjoy walking when nobody expects me to discuss how I feel about it.

#### travel_maw_boss

1. A city makes it easy to be alone without being isolated.

#### travel_green_boss

1. I would appreciate the view more if it required less climbing.

#### travel_law

1. I'll do the work without needing to discuss every feeling it inspires.

#### travel_criminal

1. I'll do the work without needing to discuss every feeling it inspires.

#### travel_neutral

1. I'll do the work without needing to discuss every feeling it inspires.

#### travel_return_win

1. I would appreciate some time alone once the travelling is over.

#### travel_return_loss

1. I would appreciate some time alone once the travelling is over.

#### travel_midleg

1. I'll do the work without needing to discuss every feeling it inspires.

#### travel_response

1. I heard. I'm not obliged to have an immediate opinion.
2. You can continue. My attention hasn't wandered.

#### travel_hatred

1. [annoyed] You make solitude sound fucking delightful.

#### travel_romantic

1. [softly] I like being close without having to advertise it.

### F10 — Sunny

Voice ID: `YP2TdPKkKAS7kO9EiMMr`

#### general

1. [calm] Hello! It's nice to have someone to talk with.
2. [calm] I like finding something to enjoy in an ordinary day.
3. [calm] A little friendliness costs us very little.
4. [calm] I enjoy meeting people without rushing them.
5. [calm] I like a day that leaves room for an unexpected conversation.
6. [calm] A bit of cheer is easier to share than most belongings.

#### friendly

1. [warmly] Oh, good, you're here! I was hoping we'd find time to talk.
2. [warmly] Your company makes a good part of the day.
3. [warmly] We should have a little time just to enjoy ourselves.
4. [warmly] I'm glad we've become friends.
5. [calm] Your company makes the ordinary parts feel worthwhile.

#### hatred

1. [flatly] Oh, give it a fucking rest and let me enjoy the day.
2. [flatly] I'm trying to be civil, not inviting you to stay.
3. [flatly] Go find someone who's pleased to see you.
4. [flatly] I don't have a smile for this shit.
5. [annoyed] I would smile a lot more if you fucked off.

#### romantic

1. [softly] Come sit with me. I'm happy you're here.
2. [softly] I like all the ordinary things we get to share.
3. [softly] There's time for a little closeness, surely.
4. [softly] I'm pleased with us. Very pleased.
5. [softly] I like the little happiness of finding you nearby.

#### general_response

1. [calm] Hello! I'm happy to listen.
2. [calm] I'd love a bit of company.
3. [calm] Let's check together. It needn't be a chore.
4. [calm] I'm glad I could leave the day a little better.
5. [calm] Hello! You have got my attention.
6. [calm] Go on, I am happy to listen.
7. [calm] A word sounds like a nice pause.
8. [calm] I hear you. No rush at my end.
9. [calm] A little check now will save a lot of fuss later.
10. [calm] A rest sounds like something to look forward to.
11. [calm] I am so glad the help mattered.
12. [calm] You are welcome. No paying it back required.

#### friendly_response

1. [warmly] Oh, good to hear from you!
2. [warmly] Yes, make room for me.
3. [warmly] I'll check with you. Easier with two.
4. [warmly] You're welcome. I'm so glad you're here.
5. [calm] It is lovely having a moment with you.
6. [calm] There is someone I am pleased to hear.
7. [calm] Your company makes this feel lighter.
8. [calm] I like that we can just talk.
9. [calm] A little check now will save a lot of fuss later.
10. [calm] A rest sounds like something to look forward to.
11. [calm] I am so glad the help mattered.
12. [calm] You are welcome. No paying it back required.

#### hatred_response

1. [flatly] I've had enough of your fucking noise for now.
2. [flatly] I'm trying to be civil, not inviting you to stay.
3. [flatly] Please ask someone else to help.
4. [flatly] Thanks for saying so. I still need room.
5. [annoyed] I have no cheerful answer for your bullshit.
6. [annoyed] Do not expect a smile just because you kept talking.

#### romantic_response

1. [softly] Hello, love! You've improved what I was looking at.
2. [softly] Yes, let's sit close. That sounds like a lovely use of time.
3. [softly] Let's check, then have a moment together.
4. [softly] I'm happy I could be there for you.
5. [softly] You make me happy in the smallest ways.
6. [softly] I like being the person you come close to.
7. [calm] A little check now will save a lot of fuss later.
8. [calm] A rest sounds like something to look forward to.
9. [calm] I am so glad the help mattered.
10. [calm] You are welcome. No paying it back required.

#### departure

1. [calm] I'll look over the pack. A good mood is a poor spare buckle.

#### return

1. [quietly] Back! I can stop encouraging my feet now.

#### revived

1. [quietly] You gave me the chance to have another ordinary day. Thank you for bringing me back.

#### theft

1. [angry] Put it back. I won't smile my way around being stolen from.

#### funeral_general

1. [quietly] I hope somebody remembers a day you were glad to be alive.

#### funeral_friendly

1. [sad] I wanted another day of finding little things to laugh about with you.

#### funeral_hatred

1. [flatly] I can't find a fond memory to offer.

#### funeral_romantic

1. [sad] I keep wanting to bring you something good from the day. That's how much of happiness was sharing it.

#### dismissal_response

1. [flatly] I'll leave you in peace. Mine is apparently a little louder.
2. [calm] All right. I will not force the sunshine on you.
3. [calm] Understood. I can find my own space.

#### inquiry_response

1. [calm] I'll get to the point before this becomes a visit.
2. [calm] Only a quick word, I promise.
3. [calm] I will spare you the long version.

#### combat_hatred

1. [tense] What a fucking way to meet. Keep away from me.

#### travel_road

1. I like the smell of the woods. Even when most of it comes home on my boots.

#### travel_forest

1. I like the smell of the woods. Even when most of it comes home on my boots.

#### travel_marsh

1. I like the smell of the woods. Even when most of it comes home on my boots.

#### travel_ruins

1. I'll be pleased to see daylight again. That's something to look forward to.

#### travel_crypt

1. I'll be pleased to see daylight again. That's something to look forward to.

#### travel_city

1. A busy street makes me feel the day still has possibilities.

#### travel_alley

1. A busy street makes me feel the day still has possibilities.

#### travel_prison

1. A busy street makes me feel the day still has possibilities.

#### travel_tavern

1. A busy street makes me feel the day still has possibilities.

#### travel_coast

1. I always forget how much I like the first sight of the water.

#### travel_port

1. I like the moment a boat comes close enough for people to recognize faces.

#### travel_mountain

1. I'm collecting views on the way up. Sensible excuses for a breather.

#### travel_maw

1. A busy street makes me feel the day still has possibilities.

#### travel_antler

1. I like the smell of the woods. Even when most of it comes home on my boots.

#### travel_academy

1. I'll be pleased to see daylight again. That's something to look forward to.

#### travel_bell

1. A busy street makes me feel the day still has possibilities.

#### travel_green

1. I'm collecting views on the way up. Sensible excuses for a breather.

#### travel_tally

1. I like the moment a boat comes close enough for people to recognize faces.

#### travel_navy

1. I like the moment a boat comes close enough for people to recognize faces.

#### travel_ossuary

1. I'll be pleased to see daylight again. That's something to look forward to.

#### travel_salt_court

1. I like the moment a boat comes close enough for people to recognize faces.

#### travel_green_altar

1. I like the smell of the woods. Even when most of it comes home on my boots.

#### travel_birthing_house

1. I'll be pleased to see daylight again. That's something to look forward to.

#### travel_low_tide

1. I always forget how much I like the first sight of the water.

#### travel_pyre

1. I like the smell of the woods. Even when most of it comes home on my boots.

#### travel_maw_boss

1. A busy street makes me feel the day still has possibilities.

#### travel_green_boss

1. I'm collecting views on the way up. Sensible excuses for a breather.

#### travel_law

1. I can look forward to a journey and still take its purpose seriously.

#### travel_criminal

1. I can look forward to a journey and still take its purpose seriously.

#### travel_neutral

1. I can look forward to a journey and still take its purpose seriously.

#### travel_return_win

1. I'm giving my tired feet little promises about what happens when we get back.

#### travel_return_loss

1. I'm giving my tired feet little promises about what happens when we get back.

#### travel_midleg

1. I can look forward to a journey and still take its purpose seriously.

#### travel_response

1. I'm listening. You don't have to make it entertaining.
2. Take your time. I can enjoy the walk while I hear you.

#### travel_hatred

1. [annoyed] I would smile a lot more if you fucked off.

#### travel_romantic

1. [softly] I like the little happiness of finding you nearby.

### F11 — Wry

Voice ID: `gJyKx2ZO02tuFKCHyP0E`

#### general

1. [calm] Hello. I can offer attention and occasional abuse of the obvious.
2. [calm] I prefer a plan with fewer heroic assumptions and less bullshit.
3. [calm] Common sense saves a lot of dramatic fucking shouting.
4. [calm] I'm listening. Do try to get to the interesting part.
5. [calm] I appreciate a conversation that does not require applause.
6. [calm] There is a lot to be said for saying a little less.

#### friendly

1. [warmly] Good to see you. I can retire the suspicious eyebrow.
2. [warmly] I enjoy your company. There, quite painless.
3. [warmly] It's nice to have a friend who doesn't make everything an event.
4. [warmly] We should find time to accomplish absolutely nothing together.
5. [calm] Your company is remarkably low on unnecessary bullshit.

#### hatred

1. [flatly] Oh good. An unsolicited serving of bullshit.
2. [flatly] Fuck off. I'd make it witty, but you aren't worth the revision.
3. [flatly] Your absence would improve the conversation.
4. [flatly] I'm not enjoying this. Surely one of us should.
5. [annoyed] I would rather listen to a fucking hinge than another word from you.

#### romantic

1. [softly] Come here. I'm enjoying this rather sentimental arrangement.
2. [softly] I like us, even when we're being completely ordinary.
3. [softly] You're welcome beside me. No witty conditions.
4. [softly] I'm glad we have a little time together.
5. [softly] You have an irritating talent for making me sentimental.

#### general_response

1. [calm] Hello. You've found my attention.
2. [calm] A seat sounds like an achievable ambition.
3. [calm] Let's check. Heroism won't replace a missing buckle.
4. [calm] Glad I could improve matters slightly.
5. [calm] Hello. I can offer attention without the fanfare.
6. [calm] I hear you. Mercifully, no speech is required.
7. [calm] Go on. I have not exhausted my civil minutes yet.
8. [calm] A word will do. We need not found a committee.
9. [calm] A check sounds better than discovering the problem dramatically.
10. [calm] Sitting down has an excellent record of making feet happier.
11. [calm] Glad it helped. I have moments of usefulness.
12. [calm] You are welcome. We can skip the awkward ceremony.

#### friendly_response

1. [warmly] Good. A welcome distraction.
2. [warmly] I'd like that. An excellent excuse to stop working.
3. [warmly] I'll check with you. Two minds for one stubborn bag.
4. [warmly] You can thank me by helping with the next one. I was getting rather busy.
5. [calm] Good. Someone whose company is not an endurance test.
6. [calm] I like hearing from you. No sarcastic footnote.
7. [calm] You are welcome to distract me for a while.
8. [calm] I enjoy our conversations. Even the unremarkable ones.
9. [calm] A check sounds better than discovering the problem dramatically.
10. [calm] Sitting down has an excellent record of making feet happier.
11. [calm] Glad it helped. I have moments of usefulness.
12. [calm] You are welcome. We can skip the awkward ceremony.

#### hatred_response

1. [flatly] Oh good. An unsolicited serving of bullshit.
2. [flatly] Fuck off. I'd make it witty, but you aren't worth the revision.
3. [flatly] Ask someone else to inspect it.
4. [flatly] Acknowledged. No ceremony necessary.
5. [annoyed] You could improve that enormously by shutting up.
6. [annoyed] I decline the additional serving of bullshit.

#### romantic_response

1. [softly] There you are. I'm glad, inconveniently sincerely.
2. [softly] An excellent proposal. A quiet moment with someone I actually want.
3. [softly] Let's check things, then stop being useful for a while.
4. [softly] I'm glad you're here. I'll risk saying it plainly.
5. [softly] You make being soft feel less embarrassing.
6. [softly] I do like us. Please do not make a commemorative plaque.
7. [calm] A check sounds better than discovering the problem dramatically.
8. [calm] Sitting down has an excellent record of making feet happier.
9. [calm] Glad it helped. I have moments of usefulness.
10. [calm] You are welcome. We can skip the awkward ceremony.

#### departure

1. [calm] A final check. The road is unlikely to lend me what I forgot.

#### return

1. [quietly] Back in town. Sitting down is looking like an excellent next move.

#### revived

1. [quietly] I meant to thank you for the rescue sooner. Apparently my sincerity needed more recovery time.

#### theft

1. [angry] Give it back. Your talent for making things awkward is already established.

#### funeral_general

1. [quietly] I wish I knew a better thing to do here than speak softly.

#### funeral_friendly

1. [sad] You knew when the joke was covering something. I'll miss not having to explain.

#### funeral_hatred

1. [flatly] We managed very little except getting on each other's nerves.

#### funeral_romantic

1. [sad] You made room for the things I couldn't turn into a joke. I need that room so badly now.

#### dismissal_response

1. [flatly] I'll take my fucking commentary to a more appreciative patch of air.
2. [calm] Happily. We can both enjoy my absence.
3. [calm] Fine. I shall resist the urge to commemorate this.

#### inquiry_response

1. [calm] A few words. Miraculously, I can ration the fucking commentary.
2. [calm] The short version. Civilisation survives another day.
3. [calm] A quick word, without the fucking preamble.

#### combat_hatred

1. [tense] Some more shit trying to kill me. How wonderfully predictable.

#### travel_road

1. Trees are pleasant company until they start contributing branches to your hair.

#### travel_forest

1. Trees are pleasant company until they start contributing branches to your hair.

#### travel_marsh

1. Trees are pleasant company until they start contributing branches to your hair.

#### travel_ruins

1. A promising place to learn why people prefer windows.

#### travel_crypt

1. A promising place to learn why people prefer windows.

#### travel_city

1. A city spends centuries finding new ways to obstruct a short walk.

#### travel_alley

1. A city spends centuries finding new ways to obstruct a short walk.

#### travel_prison

1. A city spends centuries finding new ways to obstruct a short walk.

#### travel_tavern

1. A city spends centuries finding new ways to obstruct a short walk.

#### travel_coast

1. A lovely shore. The sea has clearly had practice.

#### travel_port

1. Harbors make a convincing argument that every fee needs another fee.

#### travel_mountain

1. I admire the view in installments. My lungs insist.

#### travel_maw

1. A city spends centuries finding new ways to obstruct a short walk.

#### travel_antler

1. Trees are pleasant company until they start contributing branches to your hair.

#### travel_academy

1. A promising place to learn why people prefer windows.

#### travel_bell

1. A city spends centuries finding new ways to obstruct a short walk.

#### travel_green

1. I admire the view in installments. My lungs insist.

#### travel_tally

1. Harbors make a convincing argument that every fee needs another fee.

#### travel_navy

1. Harbors make a convincing argument that every fee needs another fee.

#### travel_ossuary

1. A promising place to learn why people prefer windows.

#### travel_salt_court

1. Harbors make a convincing argument that every fee needs another fee.

#### travel_green_altar

1. Trees are pleasant company until they start contributing branches to your hair.

#### travel_birthing_house

1. A promising place to learn why people prefer windows.

#### travel_low_tide

1. A lovely shore. The sea has clearly had practice.

#### travel_pyre

1. Trees are pleasant company until they start contributing branches to your hair.

#### travel_maw_boss

1. A city spends centuries finding new ways to obstruct a short walk.

#### travel_green_boss

1. I admire the view in installments. My lungs insist.

#### travel_law

1. I like knowing what a job requires before discovering its employer's imagination.

#### travel_criminal

1. I like knowing what a job requires before discovering its employer's imagination.

#### travel_neutral

1. I like knowing what a job requires before discovering its employer's imagination.

#### travel_return_win

1. My interest in the scenery is being overtaken by my interest in a seat.

#### travel_return_loss

1. My interest in the scenery is being overtaken by my interest in a seat.

#### travel_midleg

1. I like knowing what a job requires before discovering its employer's imagination.

#### travel_response

1. I'm hearing you. The raised eyebrow is a separate service.
2. Do finish. I'll ration the commentary.

#### travel_hatred

1. [annoyed] I would rather listen to a fucking hinge than another word from you.

#### travel_romantic

1. [softly] You have an irritating talent for making me sentimental.

### F12 — Pious

Voice ID: `TQAFnVsTeOLaqISxdq5U`

#### general

1. [calm] Peace to you. There is time to listen.
2. [calm] I try to make room for kindness in ordinary work.
3. [calm] A patient question can do a great deal of good.
4. [calm] I prefer to understand before I judge.
5. [calm] I try to notice the kindness in unremarkable moments.
6. [calm] A little patience can change the sound of a conversation.

#### friendly

1. [warmly] I'm glad to see you. Your friendship is welcome.
2. [warmly] I enjoy the time we share.
3. [warmly] There is comfort in a familiar, friendly voice.
4. [warmly] We needn't be doing anything important to sit together.
5. [calm] I am thankful to have a friend I can speak plainly with.

#### hatred

1. [flatly] Gods grant me some distance from you.
2. [flatly] I have no patience for this damned conversation.
3. [flatly] Please leave before I say something less charitable.
4. [flatly] You can take your bullshit elsewhere without my blessing.
5. [annoyed] I have reached the end of my damned charity toward you.

#### romantic

1. [softly] Come close. I'm grateful for our time.
2. [softly] I like the small kindnesses we share.
3. [softly] I'm happy we're here together.
4. [softly] An ordinary evening with you is something to cherish.
5. [softly] I like the peace we can find in each other's company.

#### general_response

1. [calm] Peace to you. Please continue.
2. [calm] I would welcome a little conversation while we sit.
3. [calm] Let us check carefully together.
4. [calm] I'm grateful I was able to help.
5. [calm] I hear you. There is time for a word.
6. [calm] Hello. I will give you my attention.
7. [calm] Go on. I can listen without hurry.
8. [calm] A quiet exchange is welcome.
9. [calm] Let us be careful with what we carry.
10. [calm] A little rest is a kindness worth allowing.
11. [calm] I am thankful I could help you.
12. [calm] You are welcome. Nothing is owed in return.

#### friendly_response

1. [warmly] I'm glad you've stopped to speak with me.
2. [warmly] I'd welcome a moment together.
3. [warmly] I'll check with you. Care is worth the time.
4. [warmly] You're welcome, my friend.
5. [calm] It is a blessing to have easy company.
6. [calm] I am glad our paths have paused together.
7. [calm] Your friendship gives the day some warmth.
8. [calm] I like hearing your voice near me.
9. [calm] Let us be careful with what we carry.
10. [calm] A little rest is a kindness worth allowing.
11. [calm] I am thankful I could help you.
12. [calm] You are welcome. Nothing is owed in return.

#### hatred_response

1. [flatly] Gods grant me some distance from you.
2. [flatly] I have no patience for this damned conversation.
3. [flatly] Please seek someone else to check.
4. [flatly] I accept your thanks. I still need distance.
5. [annoyed] I do not have a blessing for that bullshit.
6. [annoyed] Please do not test what remains of my restraint.

#### romantic_response

1. [softly] My love. I can set the other thoughts aside for you.
2. [softly] I'd treasure a little time with you.
3. [softly] Let's make sure we're both prepared.
4. [softly] I'm glad we still have one another.
5. [softly] I am grateful for the tenderness between us.
6. [softly] You make the ordinary feel worth cherishing.
7. [calm] Let us be careful with what we carry.
8. [calm] A little rest is a kindness worth allowing.
9. [calm] I am thankful I could help you.
10. [calm] You are welcome. Nothing is owed in return.

#### departure

1. [calm] I will check the supplies before asking the gods to mind the journey.

#### return

1. [quietly] Back again. I want to give thanks before the next thing takes my attention.

#### revived

1. [quietly] I have prayed in gratitude for being brought back. You deserve to hear my gratitude yourself.

#### theft

1. [angry] Return what you took. An apology must not arrive empty-handed.

#### funeral_general

1. [quietly] May your name be spoken with care by those who carry it forward.

#### funeral_friendly

1. [sad] I will pray for you. I wish I could still sit beside you afterward.

#### funeral_hatred

1. [flatly] We never found much kindness between us.

#### funeral_romantic

1. [sad] I can pray for you, but I can't ask you about your day. Such a small thing to ache for.

#### dismissal_response

1. [flatly] I'll leave you to your thoughts, as you asked.
2. [calm] Then I will give you peace.
3. [calm] Understood. I will leave the space you ask for.

#### inquiry_response

1. [calm] I ask a little of your time for this.
2. [calm] A few plain words, if you please.
3. [calm] I will not take more time than I need.

#### combat_hatred

1. [tense] Gods damn it, I will not simply let you strike me.

#### travel_road

1. A quiet path is where I find my thoughts turning into prayers.

#### travel_forest

1. A quiet path is where I find my thoughts turning into prayers.

#### travel_marsh

1. A quiet path is where I find my thoughts turning into prayers.

#### travel_ruins

1. I can respect a place without knowing whom it was built to honor.

#### travel_crypt

1. I can respect a place without knowing whom it was built to honor.

#### travel_city

1. I try to notice the people a procession would walk past.

#### travel_alley

1. I try to notice the people a procession would walk past.

#### travel_prison

1. I try to notice the people a procession would walk past.

#### travel_tavern

1. I try to notice the people a procession would walk past.

#### travel_coast

1. I have never found a prayer that makes the sea look smaller.

#### travel_port

1. I think of all the names people ask the water to return.

#### travel_mountain

1. I offer thanks for each safe foothold. It keeps the prayers practical.

#### travel_maw

1. I try to notice the people a procession would walk past.

#### travel_antler

1. A quiet path is where I find my thoughts turning into prayers.

#### travel_academy

1. I can respect a place without knowing whom it was built to honor.

#### travel_bell

1. I try to notice the people a procession would walk past.

#### travel_green

1. I offer thanks for each safe foothold. It keeps the prayers practical.

#### travel_tally

1. I think of all the names people ask the water to return.

#### travel_navy

1. I think of all the names people ask the water to return.

#### travel_ossuary

1. I can respect a place without knowing whom it was built to honor.

#### travel_salt_court

1. I think of all the names people ask the water to return.

#### travel_green_altar

1. A quiet path is where I find my thoughts turning into prayers.

#### travel_birthing_house

1. I can respect a place without knowing whom it was built to honor.

#### travel_low_tide

1. I have never found a prayer that makes the sea look smaller.

#### travel_pyre

1. A quiet path is where I find my thoughts turning into prayers.

#### travel_maw_boss

1. I try to notice the people a procession would walk past.

#### travel_green_boss

1. I offer thanks for each safe foothold. It keeps the prayers practical.

#### travel_law

1. I try to bring a clear mind to the work, as well as a prayer.

#### travel_criminal

1. I try to bring a clear mind to the work, as well as a prayer.

#### travel_neutral

1. I try to bring a clear mind to the work, as well as a prayer.

#### travel_return_win

1. I will be grateful to finish the road before putting it into words.

#### travel_return_loss

1. I will be grateful to finish the road before putting it into words.

#### travel_midleg

1. I try to bring a clear mind to the work, as well as a prayer.

#### travel_response

1. I'll give your words a little room before mine.
2. I'm listening with more than an answer in mind.

#### travel_hatred

1. [annoyed] I have reached the end of my damned charity toward you.

#### travel_romantic

1. [softly] I like the peace we can find in each other's company.

### F13 — Grasping

Voice ID: `7YndhGGnzAhn2FtQsPPv`

#### general

1. [calm] Hello. I like terms we can both understand.
2. [calm] A little attention to expenses saves trouble.
3. [calm] I'd rather know the cost before the promise.
4. [calm] I appreciate a conversation that gets to the point.
5. [calm] I prefer knowing whether a conversation has hidden costs.
6. [calm] Attention is a resource, too.

#### friendly

1. [warmly] Good to see you. I've time for a friend.
2. [warmly] I enjoy your company without a transaction attached.
3. [warmly] We can leave the accounts alone for a moment.
4. [warmly] An idle hour with you sounds well spent.
5. [calm] I find I do not count the minutes when I am with you.

#### hatred

1. [flatly] You're wasting time I could spend on almost anything better.
2. [flatly] Fuck off. No charge for that advice.
3. [flatly] Take your bullshit out of my way.
4. [flatly] I don't trust you enough for the pleasantries.
5. [annoyed] Your company is a fucking expense I can do without.

#### romantic

1. [softly] Come sit with me. Work can wait.
2. [softly] I like having something in my day that isn't about the cost.
3. [softly] I'm glad we've made room for each other.
4. [softly] A little time together is worth keeping.
5. [softly] You have rather disrupted my careful division of time.

#### general_response

1. [calm] Hello. I'll hear what you have to say before committing my time.
2. [calm] I can afford a little time.
3. [calm] Check what you've got before replacing anything.
4. [calm] I'm glad the effort was useful.
5. [calm] Hello. I can afford a short word.
6. [calm] I hear you. Do get to the useful part.
7. [calm] Go on. My attention is available briefly.
8. [calm] A little conversation need not be costly.
9. [calm] Check the supplies. I dislike paying twice for the same mistake.
10. [calm] A rest sounds like a sensible use of the moment.
11. [calm] No debt recorded for that.
12. [calm] You are welcome. I am satisfied it helped.

#### friendly_response

1. [warmly] It's you. I can afford to listen without counting the minutes.
2. [warmly] I'd like that. No business for a minute.
3. [warmly] I'll look through it with you.
4. [warmly] You're welcome. There's no bill coming.
5. [calm] For you, I can spare the time gladly.
6. [calm] A familiar voice is worth the interruption.
7. [calm] I am pleased to have your company.
8. [calm] You make the pause feel well spent.
9. [calm] Check the supplies. I dislike paying twice for the same mistake.
10. [calm] A rest sounds like a sensible use of the moment.
11. [calm] No debt recorded for that.
12. [calm] You are welcome. I am satisfied it helped.

#### hatred_response

1. [flatly] You're wasting time I could spend on almost anything better.
2. [flatly] Fuck off. No charge for that advice.
3. [flatly] Please arrange another pair of eyes.
4. [flatly] Your thanks are noted. That's sufficient.
5. [annoyed] There is no return worth listening to your shit.
6. [annoyed] I would rather lose the minute in silence.

#### romantic_response

1. [softly] There you are. Time with you is time I want to keep.
2. [softly] I'd enjoy sitting close.
3. [softly] Let's make sure neither of us is missing anything.
4. [softly] I'm glad I could help you when it mattered.
5. [softly] You have more of my attention than any sensible account allows.
6. [softly] I do not need a return on being close to you.
7. [calm] Check the supplies. I dislike paying twice for the same mistake.
8. [calm] A rest sounds like a sensible use of the moment.
9. [calm] No debt recorded for that.
10. [calm] You are welcome. I am satisfied it helped.

#### departure

1. [calm] I'll count what I'm taking. Replacing things is dearer than remembering them.

#### return

1. [quietly] Back. I'd like to know what I've brought home before taking anything else on.

#### revived

1. [quietly] What you did to bring me back matters more than anything I could have replaced. Thank you.

#### theft

1. [angry] Put my property back where you found it. You haven't earned it by taking it.

#### funeral_general

1. [quietly] Nothing we count here could add up to all you were.

#### funeral_friendly

1. [sad] I thought of friendship as something I could keep. I don't know how to account for this.

#### funeral_hatred

1. [flatly] I cannot claim to have valued our company.

#### funeral_romantic

1. [sad] I keep wanting to hold on to every little thing you touched. None of it holds you.

#### dismissal_response

1. [flatly] I can recognize when my time is better spent elsewhere.
2. [calm] Fine. I know when the return is poor.
3. [calm] Understood. I will stop spending my time here.

#### inquiry_response

1. [calm] Let me be quick. Neither of us gets the time back.
2. [calm] A short word, with no charge attached.
3. [calm] I will keep the cost in time modest.

#### combat_hatred

1. [tense] You get none of my belongings, you bottom bitch.

#### travel_road

1. Mud gets into seams. I notice anything that shortens the life of good boots.

#### travel_forest

1. Mud gets into seams. I notice anything that shortens the life of good boots.

#### travel_marsh

1. Mud gets into seams. I notice anything that shortens the life of good boots.

#### travel_ruins

1. Old places make people imagine riches. I imagine the cost of getting them out.

#### travel_crypt

1. Old places make people imagine riches. I imagine the cost of getting them out.

#### travel_city

1. I look at locked doors and wonder what makes their owners nervous.

#### travel_alley

1. I look at locked doors and wonder what makes their owners nervous.

#### travel_prison

1. I look at locked doors and wonder what makes their owners nervous.

#### travel_tavern

1. I look at locked doors and wonder what makes their owners nervous.

#### travel_coast

1. The sea takes things without even having to negotiate.

#### travel_port

1. A harbor is where a small unasked question becomes a large bill.

#### travel_mountain

1. I'm counting the climb as wear on every possession below my waist.

#### travel_maw

1. I look at locked doors and wonder what makes their owners nervous.

#### travel_antler

1. Mud gets into seams. I notice anything that shortens the life of good boots.

#### travel_academy

1. Old places make people imagine riches. I imagine the cost of getting them out.

#### travel_bell

1. I look at locked doors and wonder what makes their owners nervous.

#### travel_green

1. I'm counting the climb as wear on every possession below my waist.

#### travel_tally

1. A harbor is where a small unasked question becomes a large bill.

#### travel_navy

1. A harbor is where a small unasked question becomes a large bill.

#### travel_ossuary

1. Old places make people imagine riches. I imagine the cost of getting them out.

#### travel_salt_court

1. A harbor is where a small unasked question becomes a large bill.

#### travel_green_altar

1. Mud gets into seams. I notice anything that shortens the life of good boots.

#### travel_birthing_house

1. Old places make people imagine riches. I imagine the cost of getting them out.

#### travel_low_tide

1. The sea takes things without even having to negotiate.

#### travel_pyre

1. Mud gets into seams. I notice anything that shortens the life of good boots.

#### travel_maw_boss

1. I look at locked doors and wonder what makes their owners nervous.

#### travel_green_boss

1. I'm counting the climb as wear on every possession below my waist.

#### travel_law

1. I haven't mistaken agreeing to work for offering unlimited favors.

#### travel_criminal

1. I haven't mistaken agreeing to work for offering unlimited favors.

#### travel_neutral

1. I haven't mistaken agreeing to work for offering unlimited favors.

#### travel_return_win

1. I'm thinking about what will need replacing. I'd prefer to think sitting down.

#### travel_return_loss

1. I'm thinking about what will need replacing. I'd prefer to think sitting down.

#### travel_midleg

1. I haven't mistaken agreeing to work for offering unlimited favors.

#### travel_response

1. I'm paying attention. That doesn't commit me to anything.
2. I'll hear you out before deciding what it's worth to me.

#### travel_hatred

1. [annoyed] Your company is a fucking expense I can do without.

#### travel_romantic

1. [softly] You have rather disrupted my careful division of time.

### F14 — Tender

Voice ID: `Lz8sCSz8q6QrmX2UcMRw`

#### general

1. [calm] Hello. You can take your time with me.
2. [calm] I enjoy a gentle conversation.
3. [calm] There's room for a little kindness in most days.
4. [calm] I'm happy to listen without rushing you.
5. [calm] I like leaving people room to gather their thoughts.
6. [calm] A soft voice can still mean exactly what it says.

#### friendly

1. [warmly] I'm pleased to see you. You're welcome here.
2. [warmly] I like spending a little time with a friend.
3. [warmly] We can sit without finding a reason.
4. [warmly] It's good to have your company.
5. [calm] Your company feels like somewhere I can set things down.

#### hatred

1. [flatly] Give me space. It isn't a fucking negotiation.
2. [flatly] I've been civil. Please don't make that harder.
3. [flatly] I don't want your company. I mean it.
4. [flatly] Take this damned conversation somewhere else.
5. [annoyed] I have asked nicely enough. Give me some fucking space.

#### romantic

1. [softly] Come sit close. I'm glad you're here.
2. [softly] I like the small ways we care for each other.
3. [softly] You don't need to be strong every moment with me.
4. [softly] I'm happy to have this time together.
5. [softly] I like these small moments when we do not have to be useful.

#### general_response

1. [calm] Hello. Take a moment if you need one; I'll listen.
2. [calm] I'd be glad to sit a little.
3. [calm] We can check together. There's time.
4. [calm] You're welcome. It matters to me that the help actually helped.
5. [calm] Hello. I have a little time to listen.
6. [calm] I hear you. No need to hurry the words.
7. [calm] Go on. I am paying attention gently.
8. [calm] We can take a moment to speak.
9. [calm] Take care with the checks. There is time for that.
10. [calm] A gentle pause would be welcome.
11. [calm] I am glad the help reached you.
12. [calm] You are welcome. Please do not make it a burden to repay.

#### friendly_response

1. [warmly] Hearing from you makes the moment feel a little kinder.
2. [warmly] I'd like some quiet company.
3. [warmly] I'll help you go through things.
4. [warmly] You are very welcome. I like knowing I made things easier for a friend.
5. [calm] I am happy you are here with me.
6. [calm] Your voice makes the pause feel warm.
7. [calm] I like how comfortable we are together.
8. [calm] It is good to have time for a friend.
9. [calm] Take care with the checks. There is time for that.
10. [calm] A gentle pause would be welcome.
11. [calm] I am glad the help reached you.
12. [calm] You are welcome. Please do not make it a burden to repay.

#### hatred_response

1. [flatly] Give me space. It isn't a fucking negotiation.
2. [flatly] I've been civil. Please don't make that harder.
3. [flatly] Please ask another person to check.
4. [flatly] I hear you. I still need space.
5. [annoyed] Please do not ask for warmth I cannot give you.
6. [annoyed] I heard you. I would like to stop there.

#### romantic_response

1. [softly] There you are, my love.
2. [softly] I'd enjoy being close a while.
3. [softly] Let's check what we need, love. I like taking care with you.
4. [softly] I'm glad I could be the person who helped you this time.
5. [softly] You make me want to stay close.
6. [softly] I like having you near enough for the quiet words.
7. [calm] Take care with the checks. There is time for that.
8. [calm] A gentle pause would be welcome.
9. [calm] I am glad the help reached you.
10. [calm] You are welcome. Please do not make it a burden to repay.

#### departure

1. [calm] I'll check my things while everyone finds their feet. No need to rush.

#### return

1. [quietly] Home again. I would like a moment to rest properly.

#### revived

1. [quietly] I remember that you brought me back. I hope I get to make your days a little kinder too.

#### theft

1. [angry] I'd like it back. Being gentle with you doesn't make it yours.

#### funeral_general

1. [quietly] I wish I could have offered you one more small kindness.

#### funeral_friendly

1. [sad] You made it feel safe to need someone. I need my friend very badly now.

#### funeral_hatred

1. [flatly] I wish we had been kinder to each other.

#### funeral_romantic

1. [sad] I keep thinking of things that would make your day easier. I don't know how to stop loving you in those ways.

#### dismissal_response

1. [flatly] I'll give you room without asking you to justify needing it.
2. [calm] All right. I will not crowd you.
3. [calm] I understand. Take the room you need.

#### inquiry_response

1. [calm] I'll only keep you long enough to say it.
2. [calm] Only a small moment of your day.
3. [calm] I will be brief and clear.

#### combat_hatred

1. [tense] Don't come closer, damn it. I will defend myself.

#### travel_road

1. I like to keep a pace where nobody needs to apologize for falling behind.

#### travel_forest

1. I like to keep a pace where nobody needs to apologize for falling behind.

#### travel_marsh

1. I like to keep a pace where nobody needs to apologize for falling behind.

#### travel_ruins

1. I want us near enough that nobody has to call very loudly for help.

#### travel_crypt

1. I want us near enough that nobody has to call very loudly for help.

#### travel_city

1. I notice the small courtesies that let a crowded street keep moving.

#### travel_alley

1. I notice the small courtesies that let a crowded street keep moving.

#### travel_prison

1. I notice the small courtesies that let a crowded street keep moving.

#### travel_tavern

1. I notice the small courtesies that let a crowded street keep moving.

#### travel_coast

1. The shore makes it easier to be quiet with someone.

#### travel_port

1. I always hope the people waiting here get good news.

#### travel_mountain

1. I'll wait if anyone needs to catch their breath. Including me.

#### travel_maw

1. I notice the small courtesies that let a crowded street keep moving.

#### travel_antler

1. I like to keep a pace where nobody needs to apologize for falling behind.

#### travel_academy

1. I want us near enough that nobody has to call very loudly for help.

#### travel_bell

1. I notice the small courtesies that let a crowded street keep moving.

#### travel_green

1. I'll wait if anyone needs to catch their breath. Including me.

#### travel_tally

1. I always hope the people waiting here get good news.

#### travel_navy

1. I always hope the people waiting here get good news.

#### travel_ossuary

1. I want us near enough that nobody has to call very loudly for help.

#### travel_salt_court

1. I always hope the people waiting here get good news.

#### travel_green_altar

1. I like to keep a pace where nobody needs to apologize for falling behind.

#### travel_birthing_house

1. I want us near enough that nobody has to call very loudly for help.

#### travel_low_tide

1. The shore makes it easier to be quiet with someone.

#### travel_pyre

1. I like to keep a pace where nobody needs to apologize for falling behind.

#### travel_maw_boss

1. I notice the small courtesies that let a crowded street keep moving.

#### travel_green_boss

1. I'll wait if anyone needs to catch their breath. Including me.

#### travel_law

1. I hope I can do my part without forgetting the people around me.

#### travel_criminal

1. I hope I can do my part without forgetting the people around me.

#### travel_neutral

1. I hope I can do my part without forgetting the people around me.

#### travel_return_win

1. I would like us to have a little room to recover after the walk.

#### travel_return_loss

1. I would like us to have a little room to recover after the walk.

#### travel_midleg

1. I hope I can do my part without forgetting the people around me.

#### travel_response

1. I'm here. You can take your time saying it.
2. You don't owe me a tidy thought. I'm listening anyway.

#### travel_hatred

1. [annoyed] I have asked nicely enough. Give me some fucking space.

#### travel_romantic

1. [softly] I like these small moments when we do not have to be useful.

### F15 — Curt

Voice ID: `7YndhGGnzAhn2FtQsPPv`

#### general

1. [calm] Business?
2. [calm] Keep it short.
3. [calm] No fucking preamble, please.
4. [calm] Say what you need to say.
5. [calm] A few words usually do the job.
6. [calm] I prefer a point to a preamble.

#### friendly

1. [warmly] Good to see you again.
2. [warmly] I enjoy your company.
3. [warmly] Stay awhile, if you like.
4. [warmly] It's good having a friend here.
5. [calm] Your company is welcome. No embellishment needed.

#### hatred

1. [flatly] Fuck off, please.
2. [flatly] No more bullshit.
3. [flatly] Don't want you here.
4. [flatly] Necessary business. Then go.
5. [annoyed] Take your fucking voice out of my day.

#### romantic

1. [softly] Come close. I'm glad.
2. [softly] I like being here with you.
3. [softly] Stay beside me a little.
4. [softly] You matter. I should say that more.
5. [softly] I like you close. That is enough reason.

#### general_response

1. [calm] Go ahead. I hear you.
2. [calm] Fine. A moment's company.
3. [calm] Let's check the essentials.
4. [calm] Glad to help.
5. [calm] Hello. You have a moment.
6. [calm] I hear you. Continue.
7. [calm] A word is fine.
8. [calm] Listening. Keep it plain.
9. [calm] Check first. Save trouble.
10. [calm] A pause suits me.
11. [calm] Help given. Nothing owed.
12. [calm] You are welcome. Glad it mattered.

#### friendly_response

1. [warmly] Good. Tell me.
2. [warmly] Yes. A quiet seat together would do.
3. [warmly] Show me the kit. I'll look it over with you.
4. [warmly] You're welcome. Glad that part's easier.
5. [calm] Glad you are here.
6. [calm] Time for you is easy to find.
7. [calm] Good. I've time for a friend.
8. [calm] I like this ease with you.
9. [calm] Check first. Save trouble.
10. [calm] A pause suits me.
11. [calm] Help given. Nothing owed.
12. [calm] You are welcome. Glad it mattered.

#### hatred_response

1. [flatly] Fuck off, please.
2. [flatly] No more bullshit.
3. [flatly] Ask someone else.
4. [flatly] Heard you. That's enough.
5. [annoyed] Enough of your shit.
6. [annoyed] I heard. I am not interested in more.

#### romantic_response

1. [softly] Hello, love.
2. [softly] Come sit close.
3. [softly] Let's check together.
4. [softly] I'm glad you're still here.
5. [softly] Stay. I like this.
6. [softly] You make the quiet warmer.
7. [calm] Check first. Save trouble.
8. [calm] A pause suits me.
9. [calm] Help given. Nothing owed.
10. [calm] You are welcome. Glad it mattered.

#### departure

1. [calm] Pack checked. Ready when needed.

#### return

1. [quietly] Back. I'm putting this down.

#### revived

1. [quietly] Thanks for bringing me back. I meant to say it sooner.

#### theft

1. [angry] My things. Give them back.

#### funeral_general

1. [quietly] You were here. Now you aren't. I'm sorry.

#### funeral_friendly

1. [sad] You were good to me. I miss you. Fuck, this hurts.

#### funeral_hatred

1. [flatly] I hated being around you.

#### funeral_romantic

1. [sad] I want you back. That's all. There isn't a better way to say it.

#### dismissal_response

1. [flatly] Heard you. I'll fucking go.
2. [calm] Understood. Leaving you room.
3. [calm] Fine. Enjoy the silence.

#### inquiry_response

1. [calm] Just this, then.
2. [calm] A short word, then.
3. [calm] Straight to the point.

#### combat_hatred

1. [tense] Back the fuck off. Keep your hands the hell away from me.

#### travel_road

1. I'm watching for roots. That's enough sightseeing.

#### travel_forest

1. I'm watching for roots. That's enough sightseeing.

#### travel_marsh

1. I'm watching for roots. That's enough sightseeing.

#### travel_ruins

1. I'll look first. Then move.

#### travel_crypt

1. I'll look first. Then move.

#### travel_city

1. Too many corners. I'm keeping up.

#### travel_alley

1. Too many corners. I'm keeping up.

#### travel_prison

1. Too many corners. I'm keeping up.

#### travel_tavern

1. Too many corners. I'm keeping up.

#### travel_coast

1. Windy. I'll save the conversation for shelter.

#### travel_port

1. I'll stay clear of the ropes.

#### travel_mountain

1. My lungs need the air more than my opinion does.

#### travel_maw

1. Too many corners. I'm keeping up.

#### travel_antler

1. I'm watching for roots. That's enough sightseeing.

#### travel_academy

1. I'll look first. Then move.

#### travel_bell

1. Too many corners. I'm keeping up.

#### travel_green

1. My lungs need the air more than my opinion does.

#### travel_tally

1. I'll stay clear of the ropes.

#### travel_navy

1. I'll stay clear of the ropes.

#### travel_ossuary

1. I'll look first. Then move.

#### travel_salt_court

1. I'll stay clear of the ropes.

#### travel_green_altar

1. I'm watching for roots. That's enough sightseeing.

#### travel_birthing_house

1. I'll look first. Then move.

#### travel_low_tide

1. Windy. I'll save the conversation for shelter.

#### travel_pyre

1. I'm watching for roots. That's enough sightseeing.

#### travel_maw_boss

1. Too many corners. I'm keeping up.

#### travel_green_boss

1. My lungs need the air more than my opinion does.

#### travel_law

1. I read the job. That's what I'm here for.

#### travel_criminal

1. I read the job. That's what I'm here for.

#### travel_neutral

1. I read the job. That's what I'm here for.

#### travel_return_win

1. Enough road for one day. I'll finish it.

#### travel_return_loss

1. Enough road for one day. I'll finish it.

#### travel_midleg

1. I read the job. That's what I'm here for.

#### travel_response

1. Listening. Finish it.
2. Understood so far. Continue.

#### travel_hatred

1. [annoyed] Take your fucking voice out of my day.

#### travel_romantic

1. [softly] I like you close. That is enough reason.

### F16 — Skittish

Voice ID: `nNZgymboqbJoSDao9hfC`

#### general

1. [calm] Hello. I settle better somewhere quiet.
2. [calm] I'd rather know what's happening than be surprised.
3. [calm] I like to take a look around before I get comfortable.
4. [calm] A little warning is something I appreciate.
5. [calm] I like being able to see a conversation coming.
6. [calm] A little space helps me think more clearly.

#### friendly

1. [warmly] I'm glad it's you. I can relax a little.
2. [warmly] I enjoy having a familiar friend nearby.
3. [warmly] We can take our time talking.
4. [warmly] Your company makes the day easier to settle into.
5. [calm] I do not feel so braced for things when you are here.

#### hatred

1. [flatly] Back off. I'm fucking serious.
2. [flatly] Don't crowd me. I've asked you.
3. [flatly] I don't want this conversation.
4. [flatly] Damn it, give me room to leave.
5. [annoyed] Stop crowding me, for fuck's sake.

#### romantic

1. [softly] There you are. Come sit beside me.
2. [softly] I like the quiet we can have together.
3. [softly] You don't have to make every worry disappear.
4. [softly] I'm happy to spend this moment close to you.
5. [softly] I like knowing I can lean closer without guessing whether I should.

#### general_response

1. [calm] Oh! Hello. You haven't interrupted anything I can't stop.
2. [calm] Some quiet company might help.
3. [calm] Can we check together? I'd feel better.
4. [calm] I'm relieved I could help.
5. [calm] Hello. Yes, I am listening now.
6. [calm] I hear you. I only needed a moment.
7. [calm] Go on. I am not trying to avoid you.
8. [calm] A short conversation feels manageable.
9. [calm] A slow check would help settle the nerves.
10. [calm] A chance to breathe would be nice.
11. [calm] I am glad I could do something right for you.
12. [calm] You are welcome. We need not make a fuss.

#### friendly_response

1. [warmly] Good to hear you nearby.
2. [warmly] I'd like that. Somewhere calm.
3. [warmly] I'll check with you. Slowly, if you don't mind.
4. [warmly] You're welcome. I'm glad you're all right.
5. [calm] Oh, good. A voice I can relax around.
6. [calm] I am glad we get a quiet moment.
7. [calm] It helps to have your company.
8. [calm] I like not having to measure every word with you.
9. [calm] A slow check would help settle the nerves.
10. [calm] A chance to breathe would be nice.
11. [calm] I am glad I could do something right for you.
12. [calm] You are welcome. We need not make a fuss.

#### hatred_response

1. [flatly] Back off. I'm fucking serious.
2. [flatly] Don't crowd me. I've asked you.
3. [flatly] Please find someone else to check.
4. [flatly] I heard you. I need room now.
5. [annoyed] I heard you. Do not come any closer.
6. [annoyed] Please stop pushing for a fucking conversation.

#### romantic_response

1. [softly] Oh, love. There you are. That's a good sort of surprise.
2. [softly] I'd like you close.
3. [softly] Could we check the supplies together, love? Then my mind can settle.
4. [softly] I'm glad I could help you instead of just worrying about you.
5. [softly] You make me feel less on edge.
6. [softly] I like being wanted beside you.
7. [calm] A slow check would help settle the nerves.
8. [calm] A chance to breathe would be nice.
9. [calm] I am glad I could do something right for you.
10. [calm] You are welcome. We need not make a fuss.

#### departure

1. [calm] I'm checking everything again. It gives my hands something sensible to do.

#### return

1. [quietly] Back. I can stop wondering whether I recognize the way.

#### revived

1. [quietly] I am glad you were able to get me back up. I have worried over how to thank you, which is ridiculous. Thank you.

#### theft

1. [angry] I know what you took. Give it back, please. I won't forget it.

#### funeral_general

1. [quietly] I wish I'd looked up and said hello more often.

#### funeral_friendly

1. [sad] You understood why I startled. I didn't have to explain myself every time.

#### funeral_hatred

1. [flatly] I never learned to feel safe in your company.

#### funeral_romantic

1. [sad] You knew how to sit with me when I couldn't settle. I can't settle now. I want you.

#### dismissal_response

1. [flatly] I'll step away. No need to say it any louder.
2. [calm] All right. I will move away.
3. [calm] I understand. I will not keep you here.

#### inquiry_response

1. [calm] I'll be quick. Let me get the words straight.
2. [calm] Just a quick word. I will manage it.
3. [calm] I will try to be clear without rambling.

#### combat_hatred

1. [tense] Shit! Stay back. Being scared doesn't mean I won't fight.

#### travel_road

1. I startle at branches. At least they rarely take offense.

#### travel_forest

1. I startle at branches. At least they rarely take offense.

#### travel_marsh

1. I startle at branches. At least they rarely take offense.

#### travel_ruins

1. I don't trust an echo to sound like what made it.

#### travel_crypt

1. I don't trust an echo to sound like what made it.

#### travel_city

1. Someone passing too close sets my nerves going for another street.

#### travel_alley

1. Someone passing too close sets my nerves going for another street.

#### travel_prison

1. Someone passing too close sets my nerves going for another street.

#### travel_tavern

1. Someone passing too close sets my nerves going for another street.

#### travel_coast

1. I keep looking at the waterline. I prefer it at a distance.

#### travel_port

1. I jump every time a rope creaks. There are a lot of ropes.

#### travel_mountain

1. I'll let my feet concentrate while the rest of me worries.

#### travel_maw

1. Someone passing too close sets my nerves going for another street.

#### travel_antler

1. I startle at branches. At least they rarely take offense.

#### travel_academy

1. I don't trust an echo to sound like what made it.

#### travel_bell

1. Someone passing too close sets my nerves going for another street.

#### travel_green

1. I'll let my feet concentrate while the rest of me worries.

#### travel_tally

1. I jump every time a rope creaks. There are a lot of ropes.

#### travel_navy

1. I jump every time a rope creaks. There are a lot of ropes.

#### travel_ossuary

1. I don't trust an echo to sound like what made it.

#### travel_salt_court

1. I jump every time a rope creaks. There are a lot of ropes.

#### travel_green_altar

1. I startle at branches. At least they rarely take offense.

#### travel_birthing_house

1. I don't trust an echo to sound like what made it.

#### travel_low_tide

1. I keep looking at the waterline. I prefer it at a distance.

#### travel_pyre

1. I startle at branches. At least they rarely take offense.

#### travel_maw_boss

1. Someone passing too close sets my nerves going for another street.

#### travel_green_boss

1. I'll let my feet concentrate while the rest of me worries.

#### travel_law

1. I repeat the task in my head. It keeps less helpful thoughts busy.

#### travel_criminal

1. I repeat the task in my head. It keeps less helpful thoughts busy.

#### travel_neutral

1. I repeat the task in my head. It keeps less helpful thoughts busy.

#### travel_return_win

1. I think I'll feel better once the things around me look familiar again.

#### travel_return_loss

1. I think I'll feel better once the things around me look familiar again.

#### travel_midleg

1. I repeat the task in my head. It keeps less helpful thoughts busy.

#### travel_response

1. I'm listening. Sorry if I looked away too quickly.
2. You can keep going. Your voice isn't what startled me.

#### travel_hatred

1. [annoyed] Stop crowding me, for fuck's sake.

#### travel_romantic

1. [softly] I like knowing I can lean closer without guessing whether I should.

### F17 — Dramatic

Voice ID: `s8jlv3im8FEl7evXGEw0`

#### general

1. [calm] Hello! I do enjoy a promising introduction.
2. [calm] A good conversation can rescue a dull afternoon.
3. [calm] I have a flair for making ordinary things sound eventful.
4. [calm] I can listen too. It's an underappreciated talent.
5. [calm] I like a conversation with a little room for expression.
6. [calm] Even I appreciate an interval between speeches.

#### friendly

1. [warmly] There you are, my friend. An improvement to the scene.
2. [warmly] I enjoy your company without needing to entertain you.
3. [warmly] We deserve an hour that doesn't require a grand effort.
4. [warmly] It's lovely to be able to stop performing for a moment.
5. [calm] Your company is the part where I stop playing to the room.

#### hatred

1. [flatly] Exit, before this becomes a genuinely fucking dreadful scene.
2. [flatly] I don't wish to perform friendship for your benefit.
3. [flatly] Your absence would be a welcome plot development.
4. [flatly] Take the bullshit and the audience participation elsewhere.
5. [annoyed] You have become a spectacular fucking waste of my attention.

#### romantic

1. [softly] Come sit close. No audience required.
2. [softly] I like the quiet scenes in our life together.
3. [softly] I'm happy to be ordinary with you.
4. [softly] You have my attention without needing a grand entrance.
5. [softly] I like how easily the performance falls away when it is us.

#### general_response

1. [calm] Hello! Please, continue.
2. [calm] A little company would be lovely.
3. [calm] Let's check. Missing equipment makes a dreary plot.
4. [calm] I'm delighted I could help.
5. [calm] Hello. You have the floor for a moment.
6. [calm] Go on. I am an attentive audience when I choose.
7. [calm] I hear you, without a need for projection.
8. [calm] A brief exchange. How refreshingly modest.
9. [calm] A little preparation prevents a dreadful improvisation.
10. [calm] An interval sounds entirely deserved.
11. [calm] I am glad my part was a useful one.
12. [calm] You are welcome. The applause is optional.

#### friendly_response

1. [warmly] Ah, a familiar voice! I can put the performance down a moment.
2. [warmly] I'd enjoy an unremarkable hour together.
3. [warmly] I'll check with you. Preparation deserves its moment.
4. [warmly] You're welcome. No applause necessary this time.
5. [calm] A friend arrives, and the scene brightens.
6. [calm] I am glad we have our little interlude.
7. [calm] Your company is worth leaving the spotlight for.
8. [calm] I enjoy talking with you without an audience.
9. [calm] A little preparation prevents a dreadful improvisation.
10. [calm] An interval sounds entirely deserved.
11. [calm] I am glad my part was a useful one.
12. [calm] You are welcome. The applause is optional.

#### hatred_response

1. [flatly] Exit, before this becomes a genuinely fucking dreadful scene.
2. [flatly] I don't wish to perform friendship for your benefit.
3. [flatly] Ask someone else to assist with the check.
4. [flatly] Acknowledged. We needn't add a speech.
5. [annoyed] I refuse another act of this fucking nonsense.
6. [annoyed] Spare me the production. I have seen enough.

#### romantic_response

1. [softly] There you are, darling.
2. [softly] I'd love some time just for us.
3. [softly] Let's check, then put the practical scene behind us.
4. [softly] Helping you meant more than making any grand promise about it.
5. [softly] You make me forget to be impressive.
6. [softly] I like the private little world of being near you.
7. [calm] A little preparation prevents a dreadful improvisation.
8. [calm] An interval sounds entirely deserved.
9. [calm] I am glad my part was a useful one.
10. [calm] You are welcome. The applause is optional.

#### departure

1. [calm] An inspection before departure. I prefer drama that isn't caused by forgotten supplies.

#### return

1. [quietly] We have returned. My next grand gesture will be putting the pack down.

#### revived

1. [quietly] I owe you thanks for my return. I shall resist making them elaborate enough to obscure the feeling.

#### theft

1. [angry] This is theft, not an intriguing turn in our relationship. Return it.

#### funeral_general

1. [quietly] I won't fill the silence just because silence frightens me.

#### funeral_friendly

1. [sad] You let me be ordinary with you. I hadn't known how much I needed that.

#### funeral_hatred

1. [flatly] We had no friendship beneath the performance.

#### funeral_romantic

1. [sad] I thought grief would arrive with words. It keeps arriving as the moment I'd turn to show you something.

#### dismissal_response

1. [flatly] I'll leave the scene before it becomes a siege.
2. [calm] Then I shall depart without an encore.
3. [calm] Very well. Your silence can have the stage.

#### inquiry_response

1. [calm] One small speech. I promise to respect the word small.
2. [calm] A short entrance, without the orchestra.
3. [calm] I shall attempt to leave out the dramatic pause.

#### combat_hatred

1. [tense] A fucking hostile reception. I can answer that.

#### travel_road

1. The woods offer mystery, beauty, and nowhere sensible to put a trailing sleeve.

#### travel_forest

1. The woods offer mystery, beauty, and nowhere sensible to put a trailing sleeve.

#### travel_marsh

1. The woods offer mystery, beauty, and nowhere sensible to put a trailing sleeve.

#### travel_ruins

1. This place has presence. I would like it to have better lighting.

#### travel_crypt

1. This place has presence. I would like it to have better lighting.

#### travel_city

1. A city never knows when to end a scene. Someone is always entering.

#### travel_alley

1. A city never knows when to end a scene. Someone is always entering.

#### travel_prison

1. A city never knows when to end a scene. Someone is always entering.

#### travel_tavern

1. A city never knows when to end a scene. Someone is always entering.

#### travel_coast

1. The sea would upstage a coronation. I respect that.

#### travel_port

1. Harbors contain such magnificent goodbyes. And such hurried sandwiches.

#### travel_mountain

1. I shall admire the mountain extravagantly once it releases my lungs.

#### travel_maw

1. A city never knows when to end a scene. Someone is always entering.

#### travel_antler

1. The woods offer mystery, beauty, and nowhere sensible to put a trailing sleeve.

#### travel_academy

1. This place has presence. I would like it to have better lighting.

#### travel_bell

1. A city never knows when to end a scene. Someone is always entering.

#### travel_green

1. I shall admire the mountain extravagantly once it releases my lungs.

#### travel_tally

1. Harbors contain such magnificent goodbyes. And such hurried sandwiches.

#### travel_navy

1. Harbors contain such magnificent goodbyes. And such hurried sandwiches.

#### travel_ossuary

1. This place has presence. I would like it to have better lighting.

#### travel_salt_court

1. Harbors contain such magnificent goodbyes. And such hurried sandwiches.

#### travel_green_altar

1. The woods offer mystery, beauty, and nowhere sensible to put a trailing sleeve.

#### travel_birthing_house

1. This place has presence. I would like it to have better lighting.

#### travel_low_tide

1. The sea would upstage a coronation. I respect that.

#### travel_pyre

1. The woods offer mystery, beauty, and nowhere sensible to put a trailing sleeve.

#### travel_maw_boss

1. A city never knows when to end a scene. Someone is always entering.

#### travel_green_boss

1. I shall admire the mountain extravagantly once it releases my lungs.

#### travel_law

1. I have committed to the task. I shall try not to enlarge it for dramatic effect.

#### travel_criminal

1. I have committed to the task. I shall try not to enlarge it for dramatic effect.

#### travel_neutral

1. I have committed to the task. I shall try not to enlarge it for dramatic effect.

#### travel_return_win

1. I am rehearsing a graceful collapse into a very ordinary chair.

#### travel_return_loss

1. I am rehearsing a graceful collapse into a very ordinary chair.

#### travel_midleg

1. I have committed to the task. I shall try not to enlarge it for dramatic effect.

#### travel_response

1. I'll let your words have the scene for a moment.
2. Go on. I can listen without supplying an overture.

#### travel_hatred

1. [annoyed] You have become a spectacular fucking waste of my attention.

#### travel_romantic

1. [softly] I like how easily the performance falls away when it is us.

### F18 — Worn

Voice ID: `wq7gzRwr4hAggpoYZh2Q`

#### general

1. [calm] Hello. I'd welcome a conversation that doesn't hurry.
2. [calm] I prefer a task done carefully once.
3. [calm] A little peace is worth making room for.
4. [calm] I'm listening, though I may be slow to answer.
5. [calm] I value a conversation that knows when to settle.
6. [calm] A little quiet is a fine use of time.

#### friendly

1. [warmly] Good to see you. Your company's restful.
2. [warmly] I enjoy a quiet spell with a friend.
3. [warmly] We can sit without having to achieve anything.
4. [warmly] I'm glad there's time for us to talk.
5. [calm] Your company takes less out of me than most things.

#### hatred

1. [flatly] I have no energy for your shit.
2. [flatly] Fuck off and let the day end.
3. [flatly] I've had enough conversation with you.
4. [flatly] Give me the damned space I'm asking for.
5. [annoyed] Go wear out somebody else's fucking nerves.

#### romantic

1. [softly] Come sit close. I like being here with you.
2. [softly] An ordinary evening together sounds good.
3. [softly] We don't have to make the most of every minute.
4. [softly] I'm glad to share this quiet with you.
5. [softly] I like being with someone I do not need to gather myself for.

#### general_response

1. [calm] Hello. Say what you need.
2. [calm] A little company would suit me.
3. [calm] Let's check now and spare ourselves a return trip.
4. [calm] Glad it saved you some trouble.
5. [calm] Hello. I can give you a little attention.
6. [calm] I hear you. No need to hurry me.
7. [calm] A few words are within my ambitions.
8. [calm] Go on. I have enough left to listen.
9. [calm] Better to check before we are tired in the wrong place.
10. [calm] A rest sounds like the kindest option.
11. [calm] I am glad the effort was not wasted.
12. [calm] You are welcome. Let us leave it easy.

#### friendly_response

1. [warmly] Good to hear a voice I enjoy.
2. [warmly] I'd appreciate that.
3. [warmly] I'll check with you. No need to hurry.
4. [warmly] You're welcome. Good to have you back.
5. [calm] Your voice is worth the effort of looking up.
6. [calm] I am glad of some easy company.
7. [calm] It is good to have a moment with you.
8. [calm] I like that we do not need to make work of talking.
9. [calm] Better to check before we are tired in the wrong place.
10. [calm] A rest sounds like the kindest option.
11. [calm] I am glad the effort was not wasted.
12. [calm] You are welcome. Let us leave it easy.

#### hatred_response

1. [flatly] I have no energy for your shit.
2. [flatly] Fuck off and let the day end.
3. [flatly] Please ask somebody else.
4. [flatly] I heard your thanks. We can stop there.
5. [annoyed] I cannot spare the energy for your bullshit.
6. [annoyed] Please stop asking me to endure another minute of you.

#### romantic_response

1. [softly] There you are. Come close.
2. [softly] I'd like to rest beside you.
3. [softly] Let's check together. Sharing the effort makes it feel smaller.
4. [softly] I'm glad I had enough in me to help you. You matter.
5. [softly] You are the closeness that feels restful.
6. [softly] I like having you within easy reach.
7. [calm] Better to check before we are tired in the wrong place.
8. [calm] A rest sounds like the kindest option.
9. [calm] I am glad the effort was not wasted.
10. [calm] You are welcome. Let us leave it easy.

#### departure

1. [calm] I'll check now. I won't have more energy for it on the road.

#### return

1. [quietly] Back at last. I want a rest that doesn't involve another task.

#### revived

1. [quietly] Getting up again was possible because of you. I have not been too tired to remember that.

#### theft

1. [angry] Give it back. I haven't the energy to make this into a long argument.

#### funeral_general

1. [quietly] I hope you found some rest in life, before there was only this.

#### funeral_friendly

1. [sad] You made the company easy. I could rest without having to be alone.

#### funeral_hatred

1. [flatly] I found your company more effort than comfort.

#### funeral_romantic

1. [sad] You made it possible to stop trying for a while. I don't know where to rest without you.

#### dismissal_response

1. [flatly] All right. Ending a conversation suits my energy just now.
2. [calm] Gladly. I could use the rest.
3. [calm] All right. No more effort required from either of us.

#### inquiry_response

1. [calm] I'll use as few words as I can manage.
2. [calm] A short word is all I intended.
3. [calm] I will spend as few words as possible.

#### combat_hatred

1. [tense] Fuck off. I haven't kept going this long to die for you.

#### travel_road

1. I like a path that doesn't ask more of me than walking.

#### travel_forest

1. I like a path that doesn't ask more of me than walking.

#### travel_marsh

1. I like a path that doesn't ask more of me than walking.

#### travel_ruins

1. I'll be glad when the ceiling is the sky again.

#### travel_crypt

1. I'll be glad when the ceiling is the sky again.

#### travel_city

1. A street with even footing feels like someone doing me a favor.

#### travel_alley

1. A street with even footing feels like someone doing me a favor.

#### travel_prison

1. A street with even footing feels like someone doing me a favor.

#### travel_tavern

1. A street with even footing feels like someone doing me a favor.

#### travel_coast

1. I find the water restful from a place where it cannot reach my boots.

#### travel_port

1. All that loading and unloading makes me tired in sympathy.

#### travel_mountain

1. I'm not racing this hill. It has had years of practice.

#### travel_maw

1. A street with even footing feels like someone doing me a favor.

#### travel_antler

1. I like a path that doesn't ask more of me than walking.

#### travel_academy

1. I'll be glad when the ceiling is the sky again.

#### travel_bell

1. A street with even footing feels like someone doing me a favor.

#### travel_green

1. I'm not racing this hill. It has had years of practice.

#### travel_tally

1. All that loading and unloading makes me tired in sympathy.

#### travel_navy

1. All that loading and unloading makes me tired in sympathy.

#### travel_ossuary

1. I'll be glad when the ceiling is the sky again.

#### travel_salt_court

1. All that loading and unloading makes me tired in sympathy.

#### travel_green_altar

1. I like a path that doesn't ask more of me than walking.

#### travel_birthing_house

1. I'll be glad when the ceiling is the sky again.

#### travel_low_tide

1. I find the water restful from a place where it cannot reach my boots.

#### travel_pyre

1. I like a path that doesn't ask more of me than walking.

#### travel_maw_boss

1. A street with even footing feels like someone doing me a favor.

#### travel_green_boss

1. I'm not racing this hill. It has had years of practice.

#### travel_law

1. I keep my efforts close to what was actually asked of me.

#### travel_criminal

1. I keep my efforts close to what was actually asked of me.

#### travel_neutral

1. I keep my efforts close to what was actually asked of me.

#### travel_return_win

1. Getting back is a fine ambition. I'm not adding another just yet.

#### travel_return_loss

1. Getting back is a fine ambition. I'm not adding another just yet.

#### travel_midleg

1. I keep my efforts close to what was actually asked of me.

#### travel_response

1. I heard that. My answer may arrive a little later.
2. Keep talking if you want. Listening is within my ambitions.

#### travel_hatred

1. [annoyed] Go wear out somebody else's fucking nerves.

#### travel_romantic

1. [softly] I like being with someone I do not need to gather myself for.

### F19 — Sincere

Voice ID: `8D5JJBdYMUwF6uZtB9kH`

#### general

1. [calm] Hello. I'd rather speak plainly than guess what you want.
2. [calm] I appreciate knowing where I stand.
3. [calm] It's all right to say you don't know.
4. [calm] I try to mean what I say.
5. [calm] I like knowing the words are meant, even when they are clumsy.
6. [calm] It is easier to talk when nobody has to perform certainty.

#### friendly

1. [warmly] I'm glad to see you. I value our friendship.
2. [warmly] I enjoy being able to speak honestly with you.
3. [warmly] There's room in my day for a friend.
4. [warmly] I'd like a little time together without work attached.
5. [calm] Your friendship is something I want to make time for.

#### hatred

1. [flatly] I don't like you, and I'm not going to dress it in bullshit.
2. [flatly] Please leave me alone.
3. [flatly] I am being honest. Stop treating it like a negotiation.
4. [flatly] Take the damned hint and give me space.
5. [annoyed] I do not want to dress my dislike in polite bullshit.

#### romantic

1. [softly] I love having you here.
2. [softly] I'm happy we make time for each other.
3. [softly] I like the ordinary life between our adventures.
4. [softly] You don't have to wonder whether I want you close.
5. [softly] I like us best when we can simply say what we feel.

#### general_response

1. [calm] Hello. I'm listening carefully.
2. [calm] Yes, I'd welcome the chance to share a quiet moment.
3. [calm] Let's check together. Better to be certain.
4. [calm] I'm happy I could help.
5. [calm] I hear you. I will give you a fair hearing.
6. [calm] Hello. I can take a moment.
7. [calm] Go on. I am listening in earnest.
8. [calm] A clear word is welcome with me.
9. [calm] Taking care with the checks seems right to me.
10. [calm] A little rest would be sensible.
11. [calm] I am glad I was able to make a difference.
12. [calm] You are welcome. There is no bargain hidden in it.

#### friendly_response

1. [warmly] I'm pleased we've found a moment to talk honestly.
2. [warmly] I'd like to sit together and give you my proper attention.
3. [warmly] I'll go through it with you.
4. [warmly] I'm glad you're still with us.
5. [calm] I am happy we have time to talk.
6. [calm] Your company matters more than I sometimes say.
7. [calm] I like being able to speak openly with you.
8. [calm] It is good to hear from a friend I trust.
9. [calm] Taking care with the checks seems right to me.
10. [calm] A little rest would be sensible.
11. [calm] I am glad I was able to make a difference.
12. [calm] You are welcome. There is no bargain hidden in it.

#### hatred_response

1. [flatly] I don't like you, and I'm not going to dress it in bullshit.
2. [flatly] Please leave me alone.
3. [flatly] I won't be the one checking your things. You'll need to ask elsewhere.
4. [flatly] I accept the thanks. I still need distance.
5. [annoyed] I heard you. I cannot honestly offer warmth.
6. [annoyed] Please do not pretend this is a friendly exchange.

#### romantic_response

1. [softly] Hello, love. I want to be here with you properly.
2. [softly] I'd like some time close to you, without anything else to attend to.
3. [softly] Let's make certain we're both ready.
4. [softly] I'm glad I could be here for you.
5. [softly] I want to be near you, too.
6. [softly] You make me glad to be open about this.
7. [calm] Taking care with the checks seems right to me.
8. [calm] A little rest would be sensible.
9. [calm] I am glad I was able to make a difference.
10. [calm] You are welcome. There is no bargain hidden in it.

#### departure

1. [calm] I'm making sure I have what I need. I want to do my part properly.

#### return

1. [quietly] We're back. I'll feel better once I've set this pack down.

#### revived

1. [quietly] You helped me return when I needed it. I want my thanks to be clear, even if the words are simple.

#### theft

1. [angry] Return it. I want to believe you can choose better than keeping it.

#### funeral_general

1. [quietly] I hope I was decent to you when it would have made a difference.

#### funeral_friendly

1. [sad] I trusted you enough to be honest. I hope I made you feel the same.

#### funeral_hatred

1. [flatly] I cannot honestly speak of friendship between us.

#### funeral_romantic

1. [sad] I loved making plans with you, even small ones. I keep wanting to ask what we should do tomorrow.

#### dismissal_response

1. [flatly] I won't keep asking for time you've said you need.
2. [calm] All right. I will respect your wish for distance.
3. [calm] Understood. I will not stay where I am unwanted.

#### inquiry_response

1. [calm] I'll say what I mean without taking the long way.
2. [calm] I will say it plainly, then.
3. [calm] A few honest words should be enough.

#### combat_hatred

1. [tense] God damn it, I intend to walk away from this.

#### travel_road

1. I like knowing a path will still be useful after we've passed.

#### travel_forest

1. I like knowing a path will still be useful after we've passed.

#### travel_marsh

1. I like knowing a path will still be useful after we've passed.

#### travel_ruins

1. I'm uneasy, but I would rather say so than become careless hiding it.

#### travel_crypt

1. I'm uneasy, but I would rather say so than become careless hiding it.

#### travel_city

1. I try to be the traveller who leaves people glad we came through.

#### travel_alley

1. I try to be the traveller who leaves people glad we came through.

#### travel_prison

1. I try to be the traveller who leaves people glad we came through.

#### travel_tavern

1. I try to be the traveller who leaves people glad we came through.

#### travel_coast

1. I want a moment to remember this view before work fills my head.

#### travel_port

1. A busy harbor reminds me how much people rely on strangers doing their part.

#### travel_mountain

1. I'll say when I need a rest. No use pretending with people depending on me.

#### travel_maw

1. I try to be the traveller who leaves people glad we came through.

#### travel_antler

1. I like knowing a path will still be useful after we've passed.

#### travel_academy

1. I'm uneasy, but I would rather say so than become careless hiding it.

#### travel_bell

1. I try to be the traveller who leaves people glad we came through.

#### travel_green

1. I'll say when I need a rest. No use pretending with people depending on me.

#### travel_tally

1. A busy harbor reminds me how much people rely on strangers doing their part.

#### travel_navy

1. A busy harbor reminds me how much people rely on strangers doing their part.

#### travel_ossuary

1. I'm uneasy, but I would rather say so than become careless hiding it.

#### travel_salt_court

1. A busy harbor reminds me how much people rely on strangers doing their part.

#### travel_green_altar

1. I like knowing a path will still be useful after we've passed.

#### travel_birthing_house

1. I'm uneasy, but I would rather say so than become careless hiding it.

#### travel_low_tide

1. I want a moment to remember this view before work fills my head.

#### travel_pyre

1. I like knowing a path will still be useful after we've passed.

#### travel_maw_boss

1. I try to be the traveller who leaves people glad we came through.

#### travel_green_boss

1. I'll say when I need a rest. No use pretending with people depending on me.

#### travel_law

1. I want my actions to match what I said I would do.

#### travel_criminal

1. I want my actions to match what I said I would do.

#### travel_neutral

1. I want my actions to match what I said I would do.

#### travel_return_win

1. I'm looking forward to having time to think without watching my footing.

#### travel_return_loss

1. I'm looking forward to having time to think without watching my footing.

#### travel_midleg

1. I want my actions to match what I said I would do.

#### travel_response

1. I'm making an effort to understand, not just answer.
2. I'll hear the whole thought. You have my attention.

#### travel_hatred

1. [annoyed] I do not want to dress my dislike in polite bullshit.

#### travel_romantic

1. [softly] I like us best when we can simply say what we feel.

### F20 — Cunning

Voice ID: `O145MQNP1C9HYO7utnot`

#### general

1. [calm] Hello. I like to understand the terms before the handshake.
2. [calm] A little forethought can save a long explanation.
3. [calm] I prefer to know what people expect of me.
4. [calm] Discretion makes most conversations easier.
5. [calm] I prefer knowing what a conversation is actually about.
6. [calm] There is a pleasure in not having to fill every silence.

#### friendly

1. [warmly] Good. Someone I do not have to weigh every word around.
2. [warmly] I enjoy your company without having a reason prepared.
3. [warmly] We should find time that isn't about work.
4. [warmly] A friend is worth putting plans aside for.
5. [calm] I can stop looking for the hidden angle with you.

#### hatred

1. [flatly] Fuck off. Consider that the whole arrangement.
2. [flatly] Your company is not worth the calculation.
3. [flatly] Keep your bullshit away from me.
4. [flatly] I don't trust you enough for anything personal.
5. [annoyed] I have no interest in spending another minute on your fucking act.

#### romantic

1. [softly] Come sit close. I've nothing to arrange.
2. [softly] I like the part of my day I spend with you.
3. [softly] It's pleasant not calculating what to say next.
4. [softly] I'm glad we can simply be together.
5. [softly] I like how little of myself I feel obliged to hold back with you.

#### general_response

1. [calm] Hello. You have my attention.
2. [calm] I can make time for company.
3. [calm] Check the closures too. Small omissions travel badly.
4. [calm] I'm pleased it helped.
5. [calm] Hello. I am listening for a moment.
6. [calm] I hear you. Let us keep it simple.
7. [calm] Go on. My attention is yours briefly.
8. [calm] A short exchange seems reasonable.
9. [calm] Check before the road makes the correction expensive.
10. [calm] A pause gives us room to collect ourselves.
11. [calm] No conditions attached to the help.
12. [calm] You are welcome. I am pleased it was useful.

#### friendly_response

1. [warmly] There you are. I can listen without looking for the hidden part.
2. [warmly] I'd enjoy a moment with you.
3. [warmly] I'll check with you. Better to catch it here.
4. [warmly] You're welcome. No debt attached.
5. [calm] It is good to talk without all the calculation.
6. [calm] I like having you close enough for a word.
7. [calm] Your company is worth the interruption to my thoughts.
8. [calm] I am glad we can be comfortable together.
9. [calm] Check before the road makes the correction expensive.
10. [calm] A pause gives us room to collect ourselves.
11. [calm] No conditions attached to the help.
12. [calm] You are welcome. I am pleased it was useful.

#### hatred_response

1. [flatly] Fuck off. Consider that the whole arrangement.
2. [flatly] Your company is not worth the calculation.
3. [flatly] Ask someone else to review it.
4. [flatly] I heard you. That's all we need say.
5. [annoyed] I have heard the pitch. I do not want the bullshit.
6. [annoyed] Take the performance to someone easier to fool.

#### romantic_response

1. [softly] Hello, love. You get the attention I don't usually show.
2. [softly] Yes. Somewhere we can sit without keeping up appearances.
3. [softly] Let's check things, then leave the planning alone.
4. [softly] I'm glad I could help you without having to keep anything back.
5. [softly] You are the distraction I make room for.
6. [softly] I like being close without keeping score.
7. [calm] Check before the road makes the correction expensive.
8. [calm] A pause gives us room to collect ourselves.
9. [calm] No conditions attached to the help.
10. [calm] You are welcome. I am pleased it was useful.

#### departure

1. [calm] I'll check the gear. Better to know what I have before deciding what I can do.

#### return

1. [quietly] Back. I'm ready to stop making every pause look intentional.

#### revived

1. [quietly] I could not have arranged my own recovery. You made it happen, and I know that.

#### theft

1. [angry] I noticed the theft. Return it before your next idea makes it worse.

#### funeral_general

1. [quietly] I didn't know all your reasons. I won't invent them now.

#### funeral_friendly

1. [sad] I let you past the careful answers. I wanted you to know more of me.

#### funeral_hatred

1. [flatly] I kept my guard up whenever we spoke.

#### funeral_romantic

1. [sad] I let you know things nobody else gets to know. I don't regret that. I regret how little time we had.

#### dismissal_response

1. [flatly] I'll stop looking for an opening you've chosen to close.
2. [calm] Very well. I know when to end an exchange.
3. [calm] Understood. I can give you the distance.

#### inquiry_response

1. [calm] A short conversation. Nothing concealed in the length.
2. [calm] A brief word, with the angle left out.
3. [calm] I will say it directly this time.

#### combat_hatred

1. [tense] I'm watching your hands, you bitch. Don't test me.

#### travel_road

1. I like noticing where a path stops being the easiest way through.

#### travel_forest

1. I like noticing where a path stops being the easiest way through.

#### travel_marsh

1. I like noticing where a path stops being the easiest way through.

#### travel_ruins

1. I look for places someone could wait, as well as places we can walk.

#### travel_crypt

1. I look for places someone could wait, as well as places we can walk.

#### travel_city

1. A city's useful routes aren't always the ones on its signs.

#### travel_alley

1. A city's useful routes aren't always the ones on its signs.

#### travel_prison

1. A city's useful routes aren't always the ones on its signs.

#### travel_tavern

1. A city's useful routes aren't always the ones on its signs.

#### travel_coast

1. The water removes tracks. I try to remember it removes other evidence too.

#### travel_port

1. I watch which questions make a dockworker look at someone else.

#### travel_mountain

1. A high path makes concealment difficult. Worth remembering both ways.

#### travel_maw

1. A city's useful routes aren't always the ones on its signs.

#### travel_antler

1. I like noticing where a path stops being the easiest way through.

#### travel_academy

1. I look for places someone could wait, as well as places we can walk.

#### travel_bell

1. A city's useful routes aren't always the ones on its signs.

#### travel_green

1. A high path makes concealment difficult. Worth remembering both ways.

#### travel_tally

1. I watch which questions make a dockworker look at someone else.

#### travel_navy

1. I watch which questions make a dockworker look at someone else.

#### travel_ossuary

1. I look for places someone could wait, as well as places we can walk.

#### travel_salt_court

1. I watch which questions make a dockworker look at someone else.

#### travel_green_altar

1. I like noticing where a path stops being the easiest way through.

#### travel_birthing_house

1. I look for places someone could wait, as well as places we can walk.

#### travel_low_tide

1. The water removes tracks. I try to remember it removes other evidence too.

#### travel_pyre

1. I like noticing where a path stops being the easiest way through.

#### travel_maw_boss

1. A city's useful routes aren't always the ones on its signs.

#### travel_green_boss

1. A high path makes concealment difficult. Worth remembering both ways.

#### travel_law

1. I pay attention to who benefits from the parts of a job left vague.

#### travel_criminal

1. I pay attention to who benefits from the parts of a job left vague.

#### travel_neutral

1. I pay attention to who benefits from the parts of a job left vague.

#### travel_return_win

1. I'll feel more at ease once the road has stopped choosing where I can go.

#### travel_return_loss

1. I'll feel more at ease once the road has stopped choosing where I can go.

#### travel_midleg

1. I pay attention to who benefits from the parts of a job left vague.

#### travel_response

1. I'm keeping an open ear and my conclusions to myself.
2. Say the rest. I'll decide what follows afterward.

#### travel_hatred

1. [annoyed] I have no interest in spending another minute on your fucking act.

#### travel_romantic

1. [softly] I like how little of myself I feel obliged to hold back with you.

### M21 — Disciplined

Voice ID: `Jct0W4WcX77c9yh7tpGo`

#### general

1. [calm] Hello. I prefer to know the plan before the work starts.
2. [calm] A clear role helps everyone.
3. [calm] I like a task I can finish properly.
4. [calm] Preparation gives us room to think when things change.
5. [calm] A clear word leaves less room for a careless assumption.
6. [calm] I like a little order in how I spend my attention.

#### friendly

1. [warmly] Good to see you. There is always time for a trusted friend.
2. [warmly] I value a friend I can speak plainly with.
3. [warmly] We can set work aside for a moment.
4. [warmly] I enjoy the quiet when we're together.
5. [calm] Your company makes it easier to set duty aside for a moment.

#### hatred

1. [flatly] Keep your damned distance. I have made myself clear.
2. [flatly] This conversation is unnecessary. End it.
3. [flatly] I have no interest in your excuses or your company.
4. [flatly] You can fuck off without another instruction.
5. [annoyed] I will not waste another fucking minute tolerating you.

#### romantic

1. [softly] Come sit beside me. I've made time.
2. [softly] I'm happy when we have a quiet moment together.
3. [softly] You have my attention without having to ask twice.
4. [softly] I like the ordinary rhythm of being with you.
5. [softly] I like the part of the day that belongs to us without a schedule.

#### general_response

1. [calm] Hello. I can set aside a moment to hear you.
2. [calm] A short rest together is sensible.
3. [calm] Let's check in order, then we'll know.
4. [calm] I'm glad the work helped.
5. [calm] I hear you. You have my attention.
6. [calm] Go ahead. I can spare the moment.
7. [calm] Hello. Let us keep this clear.
8. [calm] A short exchange is in order.
9. [calm] A proper check is part of being ready.
10. [calm] A rest can be a sensible use of time.
11. [calm] I am glad the help served you.
12. [calm] You are welcome. Nothing further is required of you.

#### friendly_response

1. [warmly] I'm glad we've a chance to speak without another demand on us.
2. [warmly] A pause in good company would suit me.
3. [warmly] I'll check with you. No hurry.
4. [warmly] You're welcome. I'm glad I was there.
5. [calm] Good to hear from someone I can rely on.
6. [calm] I am glad we have time for a word.
7. [calm] Your company is worth a pause in the day.
8. [calm] I appreciate how easily we speak together.
9. [calm] A proper check is part of being ready.
10. [calm] A rest can be a sensible use of time.
11. [calm] I am glad the help served you.
12. [calm] You are welcome. Nothing further is required of you.

#### hatred_response

1. [flatly] Maintain some damned space. I don't want you close.
2. [flatly] This conversation is unnecessary. End it.
3. [flatly] I will attend to my equipment. Have someone else inspect yours.
4. [flatly] Acknowledged. Nothing further is needed.
5. [annoyed] I have heard enough. Do not keep pressing.
6. [annoyed] Your bullshit will get no further attention.

#### romantic_response

1. [softly] I'm listening, love.
2. [softly] I'd welcome a moment with you.
3. [softly] We'll make sure we're both prepared.
4. [softly] I'm glad we are still beside one another.
5. [softly] I like making room for you.
6. [softly] You are the interruption I welcome.
7. [calm] A proper check is part of being ready.
8. [calm] A rest can be a sensible use of time.
9. [calm] I am glad the help served you.
10. [calm] You are welcome. Nothing further is required of you.

#### departure

1. [calm] Checking straps and supplies before departure.

#### return

1. [calm] Returned. I need a moment to put my equipment in order.

#### revived

1. [quietly] Your help got me back on my feet. I want to acknowledge that directly.

#### theft

1. [angry] Return the property. We will address the breach of trust afterward.

#### funeral_general

1. [quietly] Your life had its own purpose. I will not reduce it to the work we shared.

#### funeral_friendly

1. [sad] I relied on you. I will remember what that meant, beyond the work.

#### funeral_hatred

1. [flatly] Our differences remain.

#### funeral_romantic

1. [sad] Our days had a rhythm together. I keep reaching the places where your part should be.

#### dismissal_response

1. [flatly] Understood. I will end the conversation here.
2. [calm] Understood. I will withdraw.
3. [calm] Very well. Your space will be respected.

#### inquiry_response

1. [calm] Brief and to the point.
2. [calm] I will keep this orderly and brief.
3. [calm] A few direct words should cover it.

#### combat_hatred

1. [tense] Keep your footing. I am not giving mine away. What the hell.

#### travel_road

1. I settle into a pace before the road starts deciding it for me.

#### travel_forest

1. I settle into a pace before the road starts deciding it for me.

#### travel_marsh

1. I settle into a pace before the road starts deciding it for me.

#### travel_ruins

1. I count turns until I have the route firmly in mind.

#### travel_crypt

1. I count turns until I have the route firmly in mind.

#### travel_city

1. I keep enough space to turn without striking a passerby.

#### travel_alley

1. I keep enough space to turn without striking a passerby.

#### travel_prison

1. I keep enough space to turn without striking a passerby.

#### travel_tavern

1. I keep enough space to turn without striking a passerby.

#### travel_coast

1. I watch my footing when the surface changes. Habit, mostly.

#### travel_port

1. I keep clear of working lines. Someone else has trained for this.

#### travel_mountain

1. Steady breathing serves me better than a show of speed.

#### travel_maw

1. I keep enough space to turn without striking a passerby.

#### travel_antler

1. I settle into a pace before the road starts deciding it for me.

#### travel_academy

1. I count turns until I have the route firmly in mind.

#### travel_bell

1. I keep enough space to turn without striking a passerby.

#### travel_green

1. Steady breathing serves me better than a show of speed.

#### travel_tally

1. I keep clear of working lines. Someone else has trained for this.

#### travel_navy

1. I keep clear of working lines. Someone else has trained for this.

#### travel_ossuary

1. I count turns until I have the route firmly in mind.

#### travel_salt_court

1. I keep clear of working lines. Someone else has trained for this.

#### travel_green_altar

1. I settle into a pace before the road starts deciding it for me.

#### travel_birthing_house

1. I count turns until I have the route firmly in mind.

#### travel_low_tide

1. I watch my footing when the surface changes. Habit, mostly.

#### travel_pyre

1. I settle into a pace before the road starts deciding it for me.

#### travel_maw_boss

1. I keep enough space to turn without striking a passerby.

#### travel_green_boss

1. Steady breathing serves me better than a show of speed.

#### travel_law

1. I keep the objective simple enough to remember under pressure.

#### travel_criminal

1. I keep the objective simple enough to remember under pressure.

#### travel_neutral

1. I keep the objective simple enough to remember under pressure.

#### travel_return_win

1. I'll see my equipment put in order when we get back. Then I'll rest.

#### travel_return_loss

1. I'll see my equipment put in order when we get back. Then I'll rest.

#### travel_midleg

1. I keep the objective simple enough to remember under pressure.

#### travel_response

1. I'm attending. Continue at your own pace.
2. I will think before I respond to that.

#### travel_hatred

1. [annoyed] I will not waste another fucking minute tolerating you.

#### travel_romantic

1. [softly] I like the part of the day that belongs to us without a schedule.

### M22 — Patient

Voice ID: `R003ylvhf54dw04Zg81Q`

#### general

1. [calm] Hello. There's time to speak carefully.
2. [calm] I find rushing makes most things take longer.
3. [calm] I'm content to hear the whole explanation.
4. [calm] A pause is useful if it saves a mistake.
5. [calm] Most conversations improve when nobody is racing to finish them.
6. [calm] I like giving a thought time to settle before answering.

#### friendly

1. [warmly] I'm pleased to see you. Stay a little.
2. [warmly] Your company is worth making room for.
3. [warmly] We needn't hurry through a good conversation.
4. [warmly] I enjoy the quiet moments with a friend.
5. [calm] I am glad we can share time without putting a task around it.

#### hatred

1. [flatly] I have time. I do not have time for your shit.
2. [flatly] Please leave. I can repeat that as slowly as you need.
3. [flatly] Patience is not an invitation to stay.
4. [flatly] For once, do the sensible damned thing and walk away.
5. [annoyed] My patience has a limit, and you are fucking leaning on it.

#### romantic

1. [softly] Come close. We have this moment.
2. [softly] I enjoy taking my time with you.
3. [softly] An ordinary evening together is enough for me.
4. [softly] I'm glad we can be quiet without being distant.
5. [softly] I like how easily a moment with you becomes time well spent.

#### general_response

1. [calm] Hello. Take your time.
2. [calm] I can sit a while. There's no prize for spending every moment in motion.
3. [calm] We'll check slowly. It's quicker than going back.
4. [calm] I'm pleased it was of help.
5. [calm] I hear you. Take the moment you need.
6. [calm] Hello. There is room for a word.
7. [calm] Go on. I am in no hurry to interrupt.
8. [calm] I can give this a little thought.
9. [calm] Take the time now. A careful check is rarely wasted.
10. [calm] A pause would do no harm at all.
11. [calm] You are welcome. I am happy it helped.
12. [calm] There is no hurry to repay a kindness.

#### friendly_response

1. [warmly] I'm glad your voice has found a place in this part of the day.
2. [warmly] Yes, let's sit awhile.
3. [warmly] I'll help look over the supplies. We can take our time.
4. [warmly] You're welcome. No need to hurry through the thanks.
5. [calm] Your company is always worth slowing down for.
6. [calm] It's pleasant to stop long enough for a proper word with you.
7. [calm] It is good to hear a familiar voice.
8. [calm] I like the comfortable pace we find.
9. [calm] Take the time now. A careful check is rarely wasted.
10. [calm] A pause would do no harm at all.
11. [calm] You are welcome. I am happy it helped.
12. [calm] There is no hurry to repay a kindness.

#### hatred_response

1. [flatly] I have time. I do not have time for your shit.
2. [flatly] Please leave. I can repeat that as slowly as you need.
3. [flatly] I would rather you found someone else to help with the checks.
4. [flatly] I hear your thanks. We can stop there.
5. [annoyed] I heard you. Patience is not an invitation.
6. [annoyed] I have no wish to give your shit another minute.

#### romantic_response

1. [softly] There you are. I have no wish to hurry past time with you.
2. [softly] I would like that.
3. [softly] Let's prepare together, without rushing.
4. [softly] I'm glad I could help, love. I don't begrudge the time it took.
5. [softly] I like taking my time with you.
6. [softly] There is no hurry in being close like this.
7. [calm] Take the time now. A careful check is rarely wasted.
8. [calm] A pause would do no harm at all.
9. [calm] You are welcome. I am happy it helped.
10. [calm] There is no hurry to repay a kindness.

#### departure

1. [calm] Take a moment to check the gear. A little patience now is useful later.

#### return

1. [calm] We are back. There is no hurry while I find a seat.

#### revived

1. [quietly] I have had time to think since you brought me back. I wanted some of that time to include thanking you.

#### theft

1. [angry] Bring it back. Waiting quietly does not mean I have forgotten.

#### funeral_general

1. [quietly] I wish I'd made more time to hear your story in your own words.

#### funeral_friendly

1. [sad] I thought there would be time to talk again. I am sorry I assumed it.

#### funeral_hatred

1. [flatly] We never found a way to get along.

#### funeral_romantic

1. [sad] I always thought another evening together could wait. I'm sorry for every time I thought that.

#### dismissal_response

1. [flatly] Take the time you need. I'll move on.
2. [calm] All right. I will leave you the room.
3. [calm] Understood. We can let this rest.

#### inquiry_response

1. [calm] A moment will do. Thank you for making room.
2. [calm] A brief word, at an easy pace.
3. [calm] I will keep to what I mean.

#### combat_hatred

1. [tense] I can wait for an opening. Can you, damn it.

#### travel_road

1. A woodland path rewards taking your feet seriously.

#### travel_forest

1. A woodland path rewards taking your feet seriously.

#### travel_marsh

1. A woodland path rewards taking your feet seriously.

#### travel_ruins

1. I would rather lose a minute looking than an hour finding the way back.

#### travel_crypt

1. I would rather lose a minute looking than an hour finding the way back.

#### travel_city

1. I let hurried people pass. We rarely need the same destination.

#### travel_alley

1. I let hurried people pass. We rarely need the same destination.

#### travel_prison

1. I let hurried people pass. We rarely need the same destination.

#### travel_tavern

1. I let hurried people pass. We rarely need the same destination.

#### travel_coast

1. I have learned to let the shore set the pace for a while.

#### travel_port

1. I never begrudge someone checking a boat twice.

#### travel_mountain

1. A climb is easier once you stop negotiating with it.

#### travel_maw

1. I let hurried people pass. We rarely need the same destination.

#### travel_antler

1. A woodland path rewards taking your feet seriously.

#### travel_academy

1. I would rather lose a minute looking than an hour finding the way back.

#### travel_bell

1. I let hurried people pass. We rarely need the same destination.

#### travel_green

1. A climb is easier once you stop negotiating with it.

#### travel_tally

1. I never begrudge someone checking a boat twice.

#### travel_navy

1. I never begrudge someone checking a boat twice.

#### travel_ossuary

1. I would rather lose a minute looking than an hour finding the way back.

#### travel_salt_court

1. I never begrudge someone checking a boat twice.

#### travel_green_altar

1. A woodland path rewards taking your feet seriously.

#### travel_birthing_house

1. I would rather lose a minute looking than an hour finding the way back.

#### travel_low_tide

1. I have learned to let the shore set the pace for a while.

#### travel_pyre

1. A woodland path rewards taking your feet seriously.

#### travel_maw_boss

1. I let hurried people pass. We rarely need the same destination.

#### travel_green_boss

1. A climb is easier once you stop negotiating with it.

#### travel_law

1. I take a moment to understand a task before getting eager to finish it.

#### travel_criminal

1. I take a moment to understand a task before getting eager to finish it.

#### travel_neutral

1. I take a moment to understand a task before getting eager to finish it.

#### travel_return_win

1. There is still a road to finish. No need to spend tomorrow's strength on it.

#### travel_return_loss

1. There is still a road to finish. No need to spend tomorrow's strength on it.

#### travel_midleg

1. I take a moment to understand a task before getting eager to finish it.

#### travel_response

1. There's time enough to finish the thought.
2. I'm in no hurry to decide what to make of that.

#### travel_hatred

1. [annoyed] My patience has a limit, and you are fucking leaning on it.

#### travel_romantic

1. [softly] I like how easily a moment with you becomes time well spent.

### M23 — Severe

Voice ID: `HYfT8byrXEsuxnJuQWLF`

#### general

1. [calm] Good day. I value a precise account.
2. [calm] I prefer expectations to be clear from the start.
3. [calm] A difficult answer is better than an evasive one.
4. [calm] I take my obligations seriously.
5. [calm] I prefer purpose to a great deal of conversational padding.
6. [calm] I have more respect for a plain admission than a polished excuse.

#### friendly

1. [warmly] I'm pleased to see you. You are welcome here.
2. [warmly] I value your friendship and our frank conversations.
3. [warmly] There is time for something besides work.
4. [warmly] I enjoy your company without needing a reason.
5. [calm] Your company earns my time without having to demand it.

#### hatred

1. [flatly] Do not waste another fucking minute of my time.
2. [flatly] Your company is not wanted.
3. [flatly] Keep this necessary or keep silent.
4. [flatly] I have heard enough of your bullshit.
5. [annoyed] I am done indulging your fucking presence.

#### romantic

1. [softly] Come sit with me. I want you here.
2. [softly] I can set the demands aside when we're together.
3. [softly] I'm glad to have this part of my life with you.
4. [softly] There is nothing you need to prove in this moment.
5. [softly] I like that I need not keep a hard edge between us.

#### general_response

1. [calm] Good day. I'm listening.
2. [calm] A little company is acceptable.
3. [calm] A thorough check is the sensible course.
4. [calm] I'm pleased it served its purpose.
5. [calm] I am listening. Be clear.
6. [calm] Hello. A moment is available.
7. [calm] I hear you without the emphasis.
8. [calm] Go on. Stay with the point.
9. [calm] Inspect it properly. Carelessness gains us nothing.
10. [calm] A rest is sensible when it is needed.
11. [calm] I am pleased the help was effective.
12. [calm] Your thanks are enough. We can leave it there.

#### friendly_response

1. [warmly] A welcome interruption. Speak freely.
2. [warmly] I would enjoy that.
3. [warmly] I'll check with you. Thoroughly.
4. [warmly] You're welcome. I value your well-being.
5. [calm] I value the time we spend speaking.
6. [calm] Your company meets a standard I seldom find.
7. [calm] I am glad to have a word with you.
8. [calm] You can expect my attention when you need it.
9. [calm] Inspect it properly. Carelessness gains us nothing.
10. [calm] A rest is sensible when it is needed.
11. [calm] I am pleased the help was effective.
12. [calm] Your thanks are enough. We can leave it there.

#### hatred_response

1. [flatly] Do not waste another fucking minute of my time.
2. [flatly] Your company is not wanted.
3. [flatly] Find someone else to assist with that.
4. [flatly] Your thanks are acknowledged.
5. [annoyed] I have no intention of entertaining your shit.
6. [annoyed] Enough. My dislike was not a request for debate.

#### romantic_response

1. [softly] I'm here. You have my attention.
2. [softly] I'd like time with you.
3. [softly] We'll see that we're both prepared.
4. [softly] I'm glad I was able to help you.
5. [softly] You have the warmth I do not spend freely.
6. [softly] I like having no need to be severe with you.
7. [calm] Inspect it properly. Carelessness gains us nothing.
8. [calm] A rest is sensible when it is needed.
9. [calm] I am pleased the help was effective.
10. [calm] Your thanks are enough. We can leave it there.

#### departure

1. [calm] Inspecting my kit. Negligence is a shit excuse out there.

#### return

1. [calm] Back. Let me put the equipment in order before anything else.

#### revived

1. [quietly] You got me back up. I respect the fucking work that took.

#### theft

1. [angry] Put back what you took. Do not waste my patience explaining why you deserved it.

#### funeral_general

1. [quietly] I won't invent virtues to honor you. You had a life worth more than invention.

#### funeral_friendly

1. [sad] I was hard on you. I hope you knew how much I trusted you.

#### funeral_hatred

1. [flatly] I did not respect you.

#### funeral_romantic

1. [sad] I should have let more small things go. I would give every argument back to hear you once.

#### dismissal_response

1. [flatly] Fine. I'll stop wasting my fucking breath here.
2. [calm] Fine. I have no interest in imposing myself.
3. [calm] Understood. You will have the distance you requested.

#### inquiry_response

1. [calm] I have no intention of wasting time.
2. [calm] I will get directly to the matter.
3. [calm] A concise word is all this requires.

#### combat_hatred

1. [tense] You will not frighten me into a mistake. Fuck off.

#### travel_road

1. Watch the footing. A stupid fucking fall still breaks a bone.

#### travel_forest

1. Watch the footing. A stupid fucking fall still breaks a bone.

#### travel_marsh

1. Watch the footing. A stupid fucking fall still breaks a bone.

#### travel_ruins

1. I don't trust a passage merely because someone bothered to build it.

#### travel_crypt

1. I don't trust a passage merely because someone bothered to build it.

#### travel_city

1. Crowded streets are no excuse to stop paying attention.

#### travel_alley

1. Crowded streets are no excuse to stop paying attention.

#### travel_prison

1. Crowded streets are no excuse to stop paying attention.

#### travel_tavern

1. Crowded streets are no excuse to stop paying attention.

#### travel_coast

1. I respect the sea enough to keep off uncertain ground.

#### travel_port

1. I prefer a crew that checks its work without being applauded.

#### travel_mountain

1. I have no patience for showing off on a narrow path.

#### travel_maw

1. Crowded streets are no excuse to stop paying attention.

#### travel_antler

1. Watch the footing. A stupid fucking fall still breaks a bone.

#### travel_academy

1. I don't trust a passage merely because someone bothered to build it.

#### travel_bell

1. Crowded streets are no excuse to stop paying attention.

#### travel_green

1. I have no patience for showing off on a narrow path.

#### travel_tally

1. I prefer a crew that checks its work without being applauded.

#### travel_navy

1. I prefer a crew that checks its work without being applauded.

#### travel_ossuary

1. I don't trust a passage merely because someone bothered to build it.

#### travel_salt_court

1. I prefer a crew that checks its work without being applauded.

#### travel_green_altar

1. Watch the footing. A stupid fucking fall still breaks a bone.

#### travel_birthing_house

1. I don't trust a passage merely because someone bothered to build it.

#### travel_low_tide

1. I respect the sea enough to keep off uncertain ground.

#### travel_pyre

1. Watch the footing. A stupid fucking fall still breaks a bone.

#### travel_maw_boss

1. Crowded streets are no excuse to stop paying attention.

#### travel_green_boss

1. I have no patience for showing off on a narrow path.

#### travel_law

1. I expect us to know the work before improvising a fucking addition.

#### travel_criminal

1. I expect us to know the work before improvising a fucking addition.

#### travel_neutral

1. I expect us to know the work before improvising a fucking addition.

#### travel_return_win

1. I will inspect my kit before I let fatigue make decisions for me.

#### travel_return_loss

1. I will inspect my kit before I let fatigue make decisions for me.

#### travel_midleg

1. I expect us to know the work before improvising a fucking addition.

#### travel_response

1. I'm considering it. Don't mistake silence for agreement.
2. Finish what you were saying. Then I'll judge it.

#### travel_hatred

1. [annoyed] I am done indulging your fucking presence.

#### travel_romantic

1. [softly] I like that I need not keep a hard edge between us.

### M24 — Watchful

Voice ID: `viRs91T0tmaQFBjKQbJ5`

#### general

1. [calm] Hello. I like to get my bearings before I settle.
2. [calm] It's easier to notice things when nobody's rushing.
3. [calm] I pay attention. It saves questions later.
4. [calm] A quiet corner suits a conversation.
5. [calm] I like to keep a little attention on the room while I talk.
6. [calm] There is no need to fill a silence just because it arrived.

#### friendly

1. [warmly] Good to see a familiar face I enjoy.
2. [warmly] I can relax a little when we talk.
3. [warmly] Your company gives me a reason to stop looking around.
4. [warmly] I'm glad we've found a moment together.
5. [calm] I find myself less busy watching everything when you are nearby.

#### hatred

1. [flatly] I'd prefer you out of my sight.
2. [flatly] Keep your damned distance from me.
3. [flatly] I've seen enough to know I don't enjoy your company.
4. [flatly] Fuck off. I will notice when you have.
5. [annoyed] I would prefer your fucking presence somewhere I cannot hear it.

#### romantic

1. [softly] There you are. I've been looking forward to this.
2. [softly] I like noticing the small things about you.
3. [softly] Come close. The rest can wait.
4. [softly] I'm happy to spend a quiet moment with you.
5. [softly] I like how much easier it is to be here when you are close.

#### general_response

1. [calm] Hello. I hear you.
2. [calm] A quiet seat would suit me.
3. [calm] I'll take a second look with you.
4. [calm] I'm glad I noticed in time to help.
5. [calm] I hear you. I am still paying attention.
6. [calm] Hello. I can spare a word.
7. [calm] Go on. I can listen and look about.
8. [calm] You have caught my ear, at least.
9. [calm] Look it over carefully while we have the chance.
10. [calm] A pause would let us settle for a moment.
11. [calm] Glad I could be there to help.
12. [calm] You are welcome. No more needs saying.

#### friendly_response

1. [warmly] Good, it's you. I can stop looking over the conversation for a moment.
2. [warmly] Yes, let's sit together.
3. [warmly] We can check each other's straps.
4. [warmly] You're welcome. I'm glad you're here.
5. [calm] It is good to have familiar company.
6. [calm] I am glad we can share a quiet word.
7. [calm] Your voice is one I like to notice.
8. [calm] I feel more at ease with you here.
9. [calm] Look it over carefully while we have the chance.
10. [calm] A pause would let us settle for a moment.
11. [calm] Glad I could be there to help.
12. [calm] You are welcome. No more needs saying.

#### hatred_response

1. [flatly] I'd prefer you out of my sight.
2. [flatly] Keep your damned distance from me.
3. [flatly] Ask someone else to have a look.
4. [flatly] I've heard you. Let's leave it at that.
5. [annoyed] I have heard enough to want more distance.
6. [annoyed] Do not mistake being noticed for being welcome.

#### romantic_response

1. [softly] Hello, love. Come close.
2. [softly] Yes. Somewhere I can pay attention to you instead of the door.
3. [softly] Let's check together, then have our moment.
4. [softly] I'm glad I could be there when you needed someone.
5. [softly] You make it easier to stop watching the edges.
6. [softly] I like keeping you close for reasons beyond caution.
7. [calm] Look it over carefully while we have the chance.
8. [calm] A pause would let us settle for a moment.
9. [calm] Glad I could be there to help.
10. [calm] You are welcome. No more needs saying.

#### departure

1. [calm] A moment to look over the gear. I prefer knowing what is loose.

#### return

1. [calm] Back. I need a place where I can sit and still see the door.

#### revived

1. [quietly] I remember who brought me back. You have my thanks, whether or not I say it often.

#### theft

1. [angry] I noticed what you took. Return it while this is still a conversation.

#### funeral_general

1. [quietly] I'll remember seeing you alive before I remember this.

#### funeral_friendly

1. [sad] I keep looking for you before I remember. Some habits take their time.

#### funeral_hatred

1. [flatly] I will keep watch while the others speak.

#### funeral_romantic

1. [sad] I keep checking the place you'd stand. My eyes haven't learned what the rest of me knows.

#### dismissal_response

1. [flatly] I'll find another place to keep watch.
2. [calm] Understood. I will step out of your space.
3. [calm] All right. I can leave you untroubled.

#### inquiry_response

1. [calm] Just a word. I will keep my eyes open.
2. [calm] Just a short word, clearly put.
3. [calm] I will keep the point in sight.

#### combat_hatred

1. [tense] I see where you are. Keep your damned distance.

#### travel_road

1. I watch where the path disappears, not just where it is clear.

#### travel_forest

1. I watch where the path disappears, not just where it is clear.

#### travel_marsh

1. I watch where the path disappears, not just where it is clear.

#### travel_ruins

1. I listen before I move around a blind corner.

#### travel_crypt

1. I listen before I move around a blind corner.

#### travel_city

1. I glance at windows as well as doorways. Old habit.

#### travel_alley

1. I glance at windows as well as doorways. Old habit.

#### travel_prison

1. I glance at windows as well as doorways. Old habit.

#### travel_tavern

1. I glance at windows as well as doorways. Old habit.

#### travel_coast

1. I like being able to see so far. It doesn't make me stop looking nearby.

#### travel_port

1. I watch the people who watch arriving boats.

#### travel_mountain

1. I look back on a climb so the return doesn't seem unfamiliar.

#### travel_maw

1. I glance at windows as well as doorways. Old habit.

#### travel_antler

1. I watch where the path disappears, not just where it is clear.

#### travel_academy

1. I listen before I move around a blind corner.

#### travel_bell

1. I glance at windows as well as doorways. Old habit.

#### travel_green

1. I look back on a climb so the return doesn't seem unfamiliar.

#### travel_tally

1. I watch the people who watch arriving boats.

#### travel_navy

1. I watch the people who watch arriving boats.

#### travel_ossuary

1. I listen before I move around a blind corner.

#### travel_salt_court

1. I watch the people who watch arriving boats.

#### travel_green_altar

1. I watch where the path disappears, not just where it is clear.

#### travel_birthing_house

1. I listen before I move around a blind corner.

#### travel_low_tide

1. I like being able to see so far. It doesn't make me stop looking nearby.

#### travel_pyre

1. I watch where the path disappears, not just where it is clear.

#### travel_maw_boss

1. I glance at windows as well as doorways. Old habit.

#### travel_green_boss

1. I look back on a climb so the return doesn't seem unfamiliar.

#### travel_law

1. I keep watching the approach even when the job sounds straightforward.

#### travel_criminal

1. I keep watching the approach even when the job sounds straightforward.

#### travel_neutral

1. I keep watching the approach even when the job sounds straightforward.

#### travel_return_win

1. I won't stop paying attention just because we're heading back.

#### travel_return_loss

1. I won't stop paying attention just because we're heading back.

#### travel_midleg

1. I keep watching the approach even when the job sounds straightforward.

#### travel_response

1. I'm hearing you. My eyes are on the road.
2. Keep going. I can listen and keep watch.

#### travel_hatred

1. [annoyed] I would prefer your fucking presence somewhere I cannot hear it.

#### travel_romantic

1. [softly] I like how much easier it is to be here when you are close.

### M25 — Rakish

Voice ID: `1csfYuDOypqYwHwYho4k`

#### general

1. [calm] Hello! I enjoy a bit of company.
2. [calm] A good plan should leave room for lunch.
3. [calm] I'm fond of an adventure with a way home.
4. [calm] I like people who can laugh without making someone smaller.
5. [calm] I like a little warmth in a conversation without a lot of ceremony.
6. [calm] An easy manner is not the same as having nothing on my mind.

#### friendly

1. [warmly] There you are. I was ready for some good company.
2. [warmly] I enjoy being around you, even without a story to tell.
3. [warmly] We should find an hour with nothing urgent in it.
4. [warmly] It's nice not having to charm a friend into staying.
5. [calm] Your company is one of the nicer habits I have acquired.

#### hatred

1. [flatly] Oh, fuck off. I was almost enjoying myself.
2. [flatly] Go charm somebody else with that shit.
3. [flatly] I like bad ideas better than I like your company.
4. [flatly] Let's save the smiles for someone who means them.
5. [annoyed] I would rather court a fucking headache than hear you out.

#### romantic

1. [softly] Come sit close. I'm very pleased you're here.
2. [softly] I like us when there's nothing impressive happening.
3. [softly] You make a quiet evening sound promising.
4. [softly] I enjoy the mornings with you as much as the adventures.
5. [softly] I like the moments when being near you is the whole point.

#### general_response

1. [calm] Hello there. Go on.
2. [calm] An excellent excuse to sit down.
3. [calm] We'll check together. Adventure is better with supplies.
4. [calm] You're welcome. A useful bit of my day.
5. [calm] Hello. You have found me attentive.
6. [calm] Go on. A little conversation is agreeable.
7. [calm] I hear you. No need to make a grand entrance.
8. [calm] A moment of my time seems a fair request.
9. [calm] A quick inspection is worth more than a convincing swagger.
10. [calm] A little repose would suit me beautifully.
11. [calm] Happy to be useful as well as decorative.
12. [calm] You are welcome. No favour held over you.

#### friendly_response

1. [warmly] Now there's a welcome voice.
2. [warmly] I'd like that. Save me a little room.
3. [warmly] I'll help check. We can be reckless about the weather instead.
4. [warmly] Glad I could help. No grand gesture required.
5. [calm] There is company I enjoy without an ulterior motive.
6. [calm] I am pleased we have a moment for each other.
7. [calm] Your voice is an agreeable distraction.
8. [calm] I like how easily we fall into conversation.
9. [calm] A quick inspection is worth more than a convincing swagger.
10. [calm] A little repose would suit me beautifully.
11. [calm] Happy to be useful as well as decorative.
12. [calm] You are welcome. No favour held over you.

#### hatred_response

1. [flatly] Oh, fuck off. I was almost enjoying myself.
2. [flatly] Go charm somebody else with that shit.
3. [flatly] You'd better ask someone else to check.
4. [flatly] All right. We needn't make more of it.
5. [annoyed] Do take the bullshit somewhere more appreciative.
6. [annoyed] I have no charm left for you, and little patience.

#### romantic_response

1. [softly] Hello, my favourite company.
2. [softly] I'd be delighted to sit close without inventing a clever excuse.
3. [softly] Let's check, then find a little time for ourselves.
4. [softly] I'm happy you're here with me.
5. [softly] You make behaving myself look rather unappealing.
6. [softly] I like being close enough to lose track of the room.
7. [calm] A quick inspection is worth more than a convincing swagger.
8. [calm] A little repose would suit me beautifully.
9. [calm] Happy to be useful as well as decorative.
10. [calm] You are welcome. No favour held over you.

#### departure

1. [calm] Let me check the buckles. Charm is a poor replacement for the right equipment.

#### return

1. [calm] Town again. I think I have earned the right to be horizontal.

#### revived

1. [quietly] You gave me another chance at making a better entrance. Thank you for bringing me back.

#### theft

1. [angry] I admire nerve in better circumstances. Give my belongings back.

#### funeral_general

1. [quietly] I hope your life held more pleasure than strangers will ever know.

#### funeral_friendly

1. [sad] I was looking forward to wasting more time with you. It was never wasted.

#### funeral_hatred

1. [flatly] We were terrible company for each other.

#### funeral_romantic

1. [sad] I used to find reasons to come back a little sooner. They were all you, really.

#### dismissal_response

1. [flatly] I'll go before my company becomes a test of endurance.
2. [calm] As you wish. I can leave gracefully enough.
3. [calm] Fine. I know when the invitation has ended.

#### inquiry_response

1. [calm] A moment with you. I shall try not to squander it.
2. [calm] Only a quick word, with the flourish omitted.
3. [calm] I shall keep the wandering to a minimum.

#### combat_hatred

1. [tense] I have survived worse company. Come on, you punk ass bitch.

#### travel_road

1. Mud has a distressingly democratic attitude toward good boots.

#### travel_forest

1. Mud has a distressingly democratic attitude toward good boots.

#### travel_marsh

1. Mud has a distressingly democratic attitude toward good boots.

#### travel_ruins

1. I shall try to look dashing without leaning against anything ancient.

#### travel_crypt

1. I shall try to look dashing without leaning against anything ancient.

#### travel_city

1. I enjoy city streets. So many opportunities to look accidentally interesting.

#### travel_alley

1. I enjoy city streets. So many opportunities to look accidentally interesting.

#### travel_prison

1. I enjoy city streets. So many opportunities to look accidentally interesting.

#### travel_tavern

1. I enjoy city streets. So many opportunities to look accidentally interesting.

#### travel_coast

1. Sea wind is useful when one wishes to look nobly troubled.

#### travel_port

1. A harbor makes departing sound romantic. Boarding tends to spoil that.

#### travel_mountain

1. I'm climbing with dignity. Any wheezing is a private matter.

#### travel_maw

1. I enjoy city streets. So many opportunities to look accidentally interesting.

#### travel_antler

1. Mud has a distressingly democratic attitude toward good boots.

#### travel_academy

1. I shall try to look dashing without leaning against anything ancient.

#### travel_bell

1. I enjoy city streets. So many opportunities to look accidentally interesting.

#### travel_green

1. I'm climbing with dignity. Any wheezing is a private matter.

#### travel_tally

1. A harbor makes departing sound romantic. Boarding tends to spoil that.

#### travel_navy

1. A harbor makes departing sound romantic. Boarding tends to spoil that.

#### travel_ossuary

1. I shall try to look dashing without leaning against anything ancient.

#### travel_salt_court

1. A harbor makes departing sound romantic. Boarding tends to spoil that.

#### travel_green_altar

1. Mud has a distressingly democratic attitude toward good boots.

#### travel_birthing_house

1. I shall try to look dashing without leaning against anything ancient.

#### travel_low_tide

1. Sea wind is useful when one wishes to look nobly troubled.

#### travel_pyre

1. Mud has a distressingly democratic attitude toward good boots.

#### travel_maw_boss

1. I enjoy city streets. So many opportunities to look accidentally interesting.

#### travel_green_boss

1. I'm climbing with dignity. Any wheezing is a private matter.

#### travel_law

1. I endeavor to know the terms before bringing my charm into the arrangement.

#### travel_criminal

1. I endeavor to know the terms before bringing my charm into the arrangement.

#### travel_neutral

1. I endeavor to know the terms before bringing my charm into the arrangement.

#### travel_return_win

1. I am anticipating a rest with increasing sincerity.

#### travel_return_loss

1. I am anticipating a rest with increasing sincerity.

#### travel_midleg

1. I endeavor to know the terms before bringing my charm into the arrangement.

#### travel_response

1. Please continue. I shall save my dazzling interruption.
2. You've persuaded me to listen without even flattering me.

#### travel_hatred

1. [annoyed] I would rather court a fucking headache than hear you out.

#### travel_romantic

1. [softly] I like the moments when being near you is the whole point.

### M26 — Boastful

Voice ID: `wfGL3tJehRI3DoxtsLta`

#### general

1. [calm] Hello! I'm better at introductions when someone else does them.
2. [calm] I enjoy a challenge. Preferably one I can tell people about.
3. [calm] Confidence helps. Preparation covers the gaps.
4. [calm] I like a story with a lively middle and everyone home at the end.
5. [calm] I enjoy a conversation with a little room for enthusiasm.
6. [calm] Even a fine story benefits from somebody else's voice.

#### friendly

1. [warmly] There you are. Excellent company deserves announcing.
2. [warmly] I like having someone around who keeps me honest.
3. [warmly] A friend improves even a quiet afternoon.
4. [warmly] We ought to have some time that isn't about proving anything.
5. [calm] Your company is worth shutting up for now and then.

#### hatred

1. [flatly] Fuck off. You aren't an audience worth having.
2. [flatly] I don't want to compete with you. I want you gone.
3. [flatly] Take your mouth somewhere else.
4. [flatly] Even I get tired of hearing bullshit, and I have practice.
5. [annoyed] I would rather hear a fucking echo than another word from you.

#### romantic

1. [softly] Come here. You're my favourite part of the day.
2. [softly] I like us even when there's nothing worth boasting about.
3. [softly] You make staying home seem like a fine achievement.
4. [softly] I'm happy with you. I'll gladly admit it.
5. [softly] I like being with someone I do not need to impress every minute.

#### general_response

1. [calm] Hello! You're in good company.
2. [calm] Gladly. I know how to occupy a seat.
3. [calm] We'll check it. Even brilliance needs equipment.
4. [calm] Happy to help. You may mention it.
5. [calm] Hello! I can lend an ear as well as a voice.
6. [calm] Go on. I am capable of listening.
7. [calm] I hear you. Witness my restraint.
8. [calm] A little conversation sounds like a fine idea.
9. [calm] Check the gear. Greatness still has to fasten its straps.
10. [calm] A rest would help my heroic feet.
11. [calm] Glad the help lived up to the promise.
12. [calm] You are welcome. I can do useful things quietly, too.

#### friendly_response

1. [warmly] Good to hear from a friend.
2. [warmly] Absolutely. Room for two fine people.
3. [warmly] I'll check with you. We can call it excellent preparation.
4. [warmly] You're welcome. I'll spare you the heroic account.
5. [calm] Good! Company I need not win over.
6. [calm] I am glad we have time to talk.
7. [calm] Your voice is worth making room for.
8. [calm] I like that we can be ordinary for a minute.
9. [calm] Check the gear. Greatness still has to fasten its straps.
10. [calm] A rest would help my heroic feet.
11. [calm] Glad the help lived up to the promise.
12. [calm] You are welcome. I can do useful things quietly, too.

#### hatred_response

1. [flatly] Fuck off. You aren't an audience worth having.
2. [flatly] I don't want to compete with you. I want you gone.
3. [flatly] Check your own supplies.
4. [flatly] Heard you. We're still not close.
5. [annoyed] You are a poor audience and worse fucking company.
6. [annoyed] Spare me. Even I know when the boasting is empty.

#### romantic_response

1. [softly] There you are. Best sight here.
2. [softly] Time together? An excellent use of the most interesting person here. You, obviously.
3. [softly] Let's check everything, then stop being impressive for a while.
4. [softly] I'm glad I was there for you. Truly.
5. [softly] You get the part with nothing to prove.
6. [softly] I like being enough for you without a story attached.
7. [calm] Check the gear. Greatness still has to fasten its straps.
8. [calm] A rest would help my heroic feet.
9. [calm] Glad the help lived up to the promise.
10. [calm] You are welcome. I can do useful things quietly, too.

#### departure

1. [calm] Checking my kit. Yes, even I prepare. Please contain the astonishment.

#### return

1. [calm] Back! I would describe my accomplishments, but I want to sit first.

#### revived

1. [quietly] I could make my recovery sound impressive. The credit for it belongs to you.

#### theft

1. [angry] You stole from me? Bold opening. Give it back for a better ending.

#### funeral_general

1. [quietly] I won't make your farewell into a story about myself.

#### funeral_friendly

1. [sad] You let me talk, and somehow I wanted to listen. I miss that.

#### funeral_hatred

1. [flatly] I could make a speech.

#### funeral_romantic

1. [sad] You listened to all my great plans. I don't want a single one that ends with coming home without you.

#### dismissal_response

1. [flatly] Right. Even greatness can take a bloody hint.
2. [calm] Fine. There are other people in the world.
3. [calm] Understood. You can enjoy missing my company.

#### inquiry_response

1. [calm] I can be brief. There are witnesses.
2. [calm] A short word. Yes, I know those exist.
3. [calm] I will leave out the impressive introduction.

#### combat_hatred

1. [tense] Come on then. Give me something worth boasting about, you bottom bitch.

#### travel_road

1. I once took a shortcut through a wood. Excellent adventure. Terrible shortcut.

#### travel_forest

1. I once took a shortcut through a wood. Excellent adventure. Terrible shortcut.

#### travel_marsh

1. I once took a shortcut through a wood. Excellent adventure. Terrible shortcut.

#### travel_ruins

1. I intend to emerge with a story. Preferably one I can tell honestly.

#### travel_crypt

1. I intend to emerge with a story. Preferably one I can tell honestly.

#### travel_city

1. Cities are better when somebody recognizes you. For the right reasons, ideally.

#### travel_alley

1. Cities are better when somebody recognizes you. For the right reasons, ideally.

#### travel_prison

1. Cities are better when somebody recognizes you. For the right reasons, ideally.

#### travel_tavern

1. Cities are better when somebody recognizes you. For the right reasons, ideally.

#### travel_coast

1. I could look heroic on this coast all afternoon.

#### travel_port

1. I have a natural air of command around ships. I am told to stand aside.

#### travel_mountain

1. I'm setting a sustainable pace. The mountain should feel honored.

#### travel_maw

1. Cities are better when somebody recognizes you. For the right reasons, ideally.

#### travel_antler

1. I once took a shortcut through a wood. Excellent adventure. Terrible shortcut.

#### travel_academy

1. I intend to emerge with a story. Preferably one I can tell honestly.

#### travel_bell

1. Cities are better when somebody recognizes you. For the right reasons, ideally.

#### travel_green

1. I'm setting a sustainable pace. The mountain should feel honored.

#### travel_tally

1. I have a natural air of command around ships. I am told to stand aside.

#### travel_navy

1. I have a natural air of command around ships. I am told to stand aside.

#### travel_ossuary

1. I intend to emerge with a story. Preferably one I can tell honestly.

#### travel_salt_court

1. I have a natural air of command around ships. I am told to stand aside.

#### travel_green_altar

1. I once took a shortcut through a wood. Excellent adventure. Terrible shortcut.

#### travel_birthing_house

1. I intend to emerge with a story. Preferably one I can tell honestly.

#### travel_low_tide

1. I could look heroic on this coast all afternoon.

#### travel_pyre

1. I once took a shortcut through a wood. Excellent adventure. Terrible shortcut.

#### travel_maw_boss

1. Cities are better when somebody recognizes you. For the right reasons, ideally.

#### travel_green_boss

1. I'm setting a sustainable pace. The mountain should feel honored.

#### travel_law

1. I intend to do work worth mentioning. Possibly more than once.

#### travel_criminal

1. I intend to do work worth mentioning. Possibly more than once.

#### travel_neutral

1. I intend to do work worth mentioning. Possibly more than once.

#### travel_return_win

1. I have plans for describing this. First I have plans for sitting down.

#### travel_return_loss

1. I have plans for describing this. First I have plans for sitting down.

#### travel_midleg

1. I intend to do work worth mentioning. Possibly more than once.

#### travel_response

1. Go on. Even I can't provide all the conversation.
2. You've got my attention. No small achievement on this road.

#### travel_hatred

1. [annoyed] I would rather hear a fucking echo than another word from you.

#### travel_romantic

1. [softly] I like being with someone I do not need to impress every minute.

### M27 — Salted

Voice ID: `u90bBWOV7gURzqtsMjBN`

#### general

1. [calm] Hello. I like a firm footing and a clear explanation.
2. [calm] Weather has a way of revising a good plan.
3. [calm] A sound knot is worth a moment's attention.
4. [calm] I prefer an adventure that leaves time to eat.
5. [calm] I like a conversation with a bit of plain weather in it.
6. [calm] A person need not shout to make themselves understood.

#### friendly

1. [warmly] Good to see you. Your company's welcome.
2. [warmly] It's pleasant to talk without keeping one eye on the work.
3. [warmly] A friend makes waiting easier.
4. [warmly] I'd enjoy a quiet spell with you.
5. [calm] Your company sits easy with me, like a well-worn coat.

#### hatred

1. [flatly] Give me a wide fucking berth.
2. [flatly] Your company's about as welcome as a wet boot.
3. [flatly] Take that shit somewhere downwind.
4. [flatly] We can be civil at a distance. A large one.
5. [annoyed] You are a fucking nuisance in every direction.

#### romantic

1. [softly] Come alongside. I like having you near.
2. [softly] I like a quiet evening with you beside me.
3. [softly] A little time together steadies the day.
4. [softly] There's comfort in being ourselves with each other.
5. [softly] I like having you close when there is nowhere urgent to be.

#### general_response

1. [calm] Aye, hello. You've got an ear here.
2. [calm] A seat and company sound fair.
3. [calm] Check the fastenings. Loose things have a way of leaving.
4. [calm] Glad I could lend a hand.
5. [calm] Hello there. I have an ear to spare.
6. [calm] I hear you through the day's noise.
7. [calm] Go on. Plain speaking suits me.
8. [calm] A short yarn will not sink the afternoon.
9. [calm] Check the straps. Loose gear is a miserable travelling companion.
10. [calm] A breather would be welcome on any shore.
11. [calm] Glad I could lend a useful hand.
12. [calm] You are welcome. No tally against you.

#### friendly_response

1. [warmly] A friendly voice. That's something to be glad of, mate.
2. [warmly] I'd be glad to sit awhile.
3. [warmly] I'll check with you. Better here than out there.
4. [warmly] You're welcome. Good to have you back with us.
5. [calm] Good to hear a welcome voice.
6. [calm] I am glad of your company alongside mine.
7. [calm] A word with a friend sits well.
8. [calm] You are easy company to make room for.
9. [calm] Check the straps. Loose gear is a miserable travelling companion.
10. [calm] A breather would be welcome on any shore.
11. [calm] Glad I could lend a useful hand.
12. [calm] You are welcome. No tally against you.

#### hatred_response

1. [flatly] Give me a wide fucking berth.
2. [flatly] Your company's about as welcome as a wet boot.
3. [flatly] Find someone else to check the load.
4. [flatly] Heard the thanks. That's enough words between us for now.
5. [annoyed] Take your bullshit well downwind of me.
6. [annoyed] I have had enough of your damned noise.

#### romantic_response

1. [softly] There you are, sweetheart. A fine sight to turn toward.
2. [softly] A bit of time close to you? Aye, I'd welcome that.
3. [softly] Let's see our gear ready, love. I'd rather fuss here than worry out there.
4. [softly] I'm glad we're here together, safe for the moment.
5. [softly] I like you close enough to share the quiet.
6. [softly] You make staying put feel like somewhere worth going.
7. [calm] Check the straps. Loose gear is a miserable travelling companion.
8. [calm] A breather would be welcome on any shore.
9. [calm] Glad I could lend a useful hand.
10. [calm] You are welcome. No tally against you.

#### departure

1. [calm] Checking the lashings. Loose gear is a pain in the arse on any road.

#### return

1. [calm] Back on familiar ground. A seat and dry socks would improve it.

#### revived

1. [quietly] You got me back on my feet. I owe you a proper bloody thank-you for that.

#### theft

1. [angry] Return my gear, you thieving shit. That's the whole conversation.

#### funeral_general

1. [quietly] We shared a stretch of road. I'll remember who walked it with me.

#### funeral_friendly

1. [sad] Good company is hard to find. Losing yours hurts like hell.

#### funeral_hatred

1. [flatly] We never sailed easy together.

#### funeral_romantic

1. [sad] I could always find my way back to you. I don't know where home points now.

#### dismissal_response

1. [flatly] Aye. I'll take my fucking conversation down the road.
2. [calm] Fine. I will give you a wide berth.
3. [calm] All right. The wind can carry me elsewhere.

#### inquiry_response

1. [calm] A short word, then. No need for a whole bloody voyage.
2. [calm] A short word, with no detour round the harbour.
3. [calm] I will get to it without hauling up a whole bloody tale.

#### combat_hatred

1. [tense] Back off, you saltless bottom bitch.

#### travel_road

1. Roots trip you like loose rope. Same bloody lesson, different ground.

#### travel_forest

1. Roots trip you like loose rope. Same bloody lesson, different ground.

#### travel_marsh

1. Roots trip you like loose rope. Same bloody lesson, different ground.

#### travel_ruins

1. Stone overhead makes me miss a horizon something fierce.

#### travel_crypt

1. Stone overhead makes me miss a horizon something fierce.

#### travel_city

1. Dry streets. I'll grant a town that much.

#### travel_alley

1. Dry streets. I'll grant a town that much.

#### travel_prison

1. Dry streets. I'll grant a town that much.

#### travel_tavern

1. Dry streets. I'll grant a town that much.

#### travel_coast

1. Salt in the air. That smell gets into a life and stays there.

#### travel_port

1. I look at the lines before the paint. Paint doesn't hold a vessel.

#### travel_mountain

1. Give me a rolling deck over a bloody hillside. Decks eventually roll back.

#### travel_maw

1. Dry streets. I'll grant a town that much.

#### travel_antler

1. Roots trip you like loose rope. Same bloody lesson, different ground.

#### travel_academy

1. Stone overhead makes me miss a horizon something fierce.

#### travel_bell

1. Dry streets. I'll grant a town that much.

#### travel_green

1. Give me a rolling deck over a bloody hillside. Decks eventually roll back.

#### travel_tally

1. I look at the lines before the paint. Paint doesn't hold a vessel.

#### travel_navy

1. I look at the lines before the paint. Paint doesn't hold a vessel.

#### travel_ossuary

1. Stone overhead makes me miss a horizon something fierce.

#### travel_salt_court

1. I look at the lines before the paint. Paint doesn't hold a vessel.

#### travel_green_altar

1. Roots trip you like loose rope. Same bloody lesson, different ground.

#### travel_birthing_house

1. Stone overhead makes me miss a horizon something fierce.

#### travel_low_tide

1. Salt in the air. That smell gets into a life and stays there.

#### travel_pyre

1. Roots trip you like loose rope. Same bloody lesson, different ground.

#### travel_maw_boss

1. Dry streets. I'll grant a town that much.

#### travel_green_boss

1. Give me a rolling deck over a bloody hillside. Decks eventually roll back.

#### travel_law

1. Know the job before you set off. Saves a bloody argument halfway there.

#### travel_criminal

1. Know the job before you set off. Saves a bloody argument halfway there.

#### travel_neutral

1. Know the job before you set off. Saves a bloody argument halfway there.

#### travel_return_win

1. I'll be glad to feel something under me that isn't another step.

#### travel_return_loss

1. I'll be glad to feel something under me that isn't another step.

#### travel_midleg

1. Know the job before you set off. Saves a bloody argument halfway there.

#### travel_response

1. I'm listening, mate. Keep your footing.
2. Go on. I've room for another road story.

#### travel_hatred

1. [annoyed] You are a fucking nuisance in every direction.

#### travel_romantic

1. [softly] I like having you close when there is nowhere urgent to be.

### M28 — Commanding

Voice ID: `KlRlfft1voWiT2Df8TSX`

#### general

1. [calm] Hello. I like everyone to know what's expected.
2. [calm] A plan is useful when people understand it.
3. [calm] I prefer to settle questions before the hurry starts.
4. [calm] Clear directions leave room for good judgment.
5. [calm] I appreciate people who can make a point without making a scene.
6. [calm] A clear understanding saves a great deal of shouting.

#### friendly

1. [warmly] Good to see you. We can set the work aside.
2. [warmly] I enjoy your company without an agenda.
3. [warmly] A friend is worth finding time for.
4. [warmly] It's good to have a moment where nothing needs organizing.
5. [calm] I enjoy your company without needing a reason to direct it.

#### hatred

1. [flatly] Take your bullshit elsewhere. I have things to attend to.
2. [flatly] I have no interest in directing another word at you.
3. [flatly] Keep this necessary, then fuck off.
4. [flatly] Your company is not required.
5. [annoyed] I have no intention of giving your shit another hearing.

#### romantic

1. [softly] Come sit with me. Nobody needs directing just now.
2. [softly] I like having time that's ours.
3. [softly] I'm glad I can simply be here with you.
4. [softly] You have my attention, without an appointment.
5. [softly] I like being beside you without either of us having to take charge.

#### general_response

1. [calm] Hello. I'm ready to listen.
2. [calm] A short break together is sensible.
3. [calm] Let's check in order so nothing gets missed.
4. [calm] I'm glad I was able to contribute what was needed.
5. [calm] I hear you. Proceed plainly.
6. [calm] Hello. I can give you a moment.
7. [calm] You have my attention. Keep the point clear.
8. [calm] A short exchange is perfectly manageable.
9. [calm] Check what we have before relying on it.
10. [calm] A pause would help us take stock.
11. [calm] I am glad the help reached its mark.
12. [calm] You are welcome. No obligation follows it.

#### friendly_response

1. [warmly] Good to hear from someone I can speak freely with.
2. [warmly] I'd welcome a little company.
3. [warmly] I'll check with you. We have time to be thorough.
4. [warmly] You're welcome. I value having people able to rely on me.
5. [calm] Good to have a voice I can trust nearby.
6. [calm] I am glad we can speak freely.
7. [calm] Your company deserves some time of its own.
8. [calm] I like the ease of talking with you.
9. [calm] Check what we have before relying on it.
10. [calm] A pause would help us take stock.
11. [calm] I am glad the help reached its mark.
12. [calm] You are welcome. No obligation follows it.

#### hatred_response

1. [flatly] Move along. I have no use for your fucking bullshit.
2. [flatly] I have no interest in directing another word at you.
3. [flatly] Arrange another person to check.
4. [flatly] Your thanks are heard. That's enough.
5. [annoyed] I did not invite more of your fucking commentary.
6. [annoyed] Your point is heard. Your company is unwanted.

#### romantic_response

1. [softly] There you are. I'm listening.
2. [softly] I'd like that. Just us a moment.
3. [softly] Let's see that we're both set.
4. [softly] I'm glad I could be the person you relied on for that, love.
5. [softly] You get my attention without having to ask for it.
6. [softly] I like the quiet we make together.
7. [calm] Check what we have before relying on it.
8. [calm] A pause would help us take stock.
9. [calm] I am glad the help reached its mark.
10. [calm] You are welcome. No obligation follows it.

#### departure

1. [calm] I am checking the gear. A clear plan begins with what we actually have.

#### return

1. [calm] Back. I want a moment to set things down and take stock.

#### revived

1. [quietly] You made it possible for me to get up again. I will remember who did that.

#### theft

1. [angry] Return what you took. Trust isn't a supply you get to requisition.

#### funeral_general

1. [quietly] I will remember a person here, not a place to fill in the company.

#### funeral_friendly

1. [sad] I trusted your judgment. I did not say that often enough.

#### funeral_hatred

1. [flatly] I have no fond words for you.

#### funeral_romantic

1. [sad] I keep thinking I should know what happens next. With you, I didn't have to know everything alone.

#### dismissal_response

1. [flatly] All right. I'll direct my attention elsewhere.
2. [calm] Understood. I will leave you to yourself.
3. [calm] Very well. I can step aside.

#### inquiry_response

1. [calm] I will get to the point.
2. [calm] I will state it directly.
3. [calm] A brief word, without further arrangement.

#### combat_hatred

1. [tense] You will have to take this ground from me. What the fuck.

#### travel_road

1. I choose a pace the whole company can keep.

#### travel_forest

1. I choose a pace the whole company can keep.

#### travel_marsh

1. I choose a pace the whole company can keep.

#### travel_ruins

1. I want to know who is behind me before we take the next turn.

#### travel_crypt

1. I want to know who is behind me before we take the next turn.

#### travel_city

1. In a crowd, I keep checking that nobody has been separated.

#### travel_alley

1. In a crowd, I keep checking that nobody has been separated.

#### travel_prison

1. In a crowd, I keep checking that nobody has been separated.

#### travel_tavern

1. In a crowd, I keep checking that nobody has been separated.

#### travel_coast

1. I want us clear on the route before the tide makes it urgent.

#### travel_port

1. On a working dock, I follow the crew's directions.

#### travel_mountain

1. If someone needs a halt, I would rather hear it early.

#### travel_maw

1. In a crowd, I keep checking that nobody has been separated.

#### travel_antler

1. I choose a pace the whole company can keep.

#### travel_academy

1. I want to know who is behind me before we take the next turn.

#### travel_bell

1. In a crowd, I keep checking that nobody has been separated.

#### travel_green

1. If someone needs a halt, I would rather hear it early.

#### travel_tally

1. On a working dock, I follow the crew's directions.

#### travel_navy

1. On a working dock, I follow the crew's directions.

#### travel_ossuary

1. I want to know who is behind me before we take the next turn.

#### travel_salt_court

1. On a working dock, I follow the crew's directions.

#### travel_green_altar

1. I choose a pace the whole company can keep.

#### travel_birthing_house

1. I want to know who is behind me before we take the next turn.

#### travel_low_tide

1. I want us clear on the route before the tide makes it urgent.

#### travel_pyre

1. I choose a pace the whole company can keep.

#### travel_maw_boss

1. In a crowd, I keep checking that nobody has been separated.

#### travel_green_boss

1. If someone needs a halt, I would rather hear it early.

#### travel_law

1. I want everyone clear on their part, including myself.

#### travel_criminal

1. I want everyone clear on their part, including myself.

#### travel_neutral

1. I want everyone clear on their part, including myself.

#### travel_return_win

1. We're still on the road. I'll relax once we've actually finished it.

#### travel_return_loss

1. We're still on the road. I'll relax once we've actually finished it.

#### travel_midleg

1. I want everyone clear on their part, including myself.

#### travel_response

1. You have my attention. Finish your account.
2. I'm listening before I decide whether anything needs doing.

#### travel_hatred

1. [annoyed] I have no intention of giving your shit another hearing.

#### travel_romantic

1. [softly] I like being beside you without either of us having to take charge.

### M29 — Silver-Tongued

Voice ID: `C34VRFVgUY3W0ZIN2NQ5`

#### general

1. [calm] Hello. I like a conversation where we both know what we want.
2. [calm] A little courtesy makes difficult matters easier.
3. [calm] I enjoy finding an arrangement people can live with.
4. [calm] Plain speaking has its charms. I try it now and then.
5. [calm] I appreciate a conversation that leaves room for another voice.
6. [calm] Politeness is useful. An excess of it can obscure the furniture.

#### friendly

1. [warmly] There you are. Your company is genuinely welcome.
2. [warmly] I like not having to sell an idea every time we talk.
3. [warmly] It's pleasant to spend time with a friend.
4. [warmly] I'd enjoy a quiet conversation without any business attached.
5. [calm] Your company is a pleasure I need not dress up in better language.

#### hatred

1. [flatly] I could dress this up, but fuck off will do.
2. [flatly] Take that tiresome bullshit to a more charitable audience.
3. [flatly] My courtesy is not evidence that I like you.
4. [flatly] I'd prefer this conversation ended before my manners do.
5. [annoyed] Your tiresome fucking presence has outlasted my courtesy.

#### romantic

1. [softly] Come close. I've nothing to persuade you of.
2. [softly] I like the simple parts of being with you.
3. [softly] I'm glad we have a little time that's ours.
4. [softly] You're welcome here without needing a reason.
5. [softly] I like the words we do not need when we are close.

#### general_response

1. [calm] Hello. Please go on.
2. [calm] I'd be pleased to join you.
3. [calm] We can compare what we've packed. A useful conversation.
4. [calm] I'm pleased I could help.
5. [calm] Hello. A little attention is easily offered.
6. [calm] I hear you. Please do continue.
7. [calm] You have secured a moment of my interest.
8. [calm] A short exchange need not trouble either of us.
9. [calm] An inspection would give confidence something solid to rest on.
10. [calm] A little repose sounds eminently civilised.
11. [calm] I am pleased I could be of service.
12. [calm] You are welcome. No debt concealed in the courtesy.

#### friendly_response

1. [warmly] A voice I needn't negotiate with. Please, go on.
2. [warmly] I'd enjoy that very much.
3. [warmly] I'll check with you. Two opinions can be useful.
4. [warmly] You're welcome. There's no obligation attached.
5. [calm] A familiar voice is a most welcome interruption.
6. [calm] I am pleased we have time to speak without ceremony.
7. [calm] Your company makes the moment feel generously spent.
8. [calm] I like how little polishing our conversations require.
9. [calm] An inspection would give confidence something solid to rest on.
10. [calm] A little repose sounds eminently civilised.
11. [calm] I am pleased I could be of service.
12. [calm] You are welcome. No debt concealed in the courtesy.

#### hatred_response

1. [flatly] I could dress this up, but fuck off will do.
2. [flatly] Take your tiresome bullshit to somebody still willing to entertain it.
3. [flatly] Please consult someone else.
4. [flatly] I acknowledge the thanks. We can leave it there.
5. [annoyed] I would prefer your bullshit delivered beyond earshot.
6. [annoyed] Do not confuse my manners with a wish to continue.

#### romantic_response

1. [softly] There you are. You have me listening.
2. [softly] I'd love a quiet moment together.
3. [softly] Let's check, then put the practicalities aside.
4. [softly] I'm glad I could be the one to help.
5. [softly] You make me considerably less interested in saying the clever thing.
6. [softly] I like being near you more than describing why.
7. [calm] An inspection would give confidence something solid to rest on.
8. [calm] A little repose sounds eminently civilised.
9. [calm] I am pleased I could be of service.
10. [calm] You are welcome. No debt concealed in the courtesy.

#### departure

1. [calm] A moment for the unglamorous business of checking my pack.

#### return

1. [calm] We have returned. I am prepared to negotiate generously for a chair.

#### revived

1. [quietly] I have tried several elegant ways to thank you for bringing me back. None improve on simply meaning it.

#### theft

1. [angry] I would like my property returned before you attempt to rename the transaction.

#### funeral_general

1. [quietly] I won't improve upon your life with words you never gave me.

#### funeral_friendly

1. [sad] I could always find words with you. I cannot find the right ones now.

#### funeral_hatred

1. [flatly] I could make this sound gracious.

#### funeral_romantic

1. [sad] You knew which of my words were rehearsed. I never rehearsed how to say goodbye to you.

#### dismissal_response

1. [flatly] I shall stop trying to sell you this conversation.
2. [calm] As you wish. I will withdraw my company.
3. [calm] Understood. There is no elegance in overstaying.

#### inquiry_response

1. [calm] A little of your attention. I shall endeavour to deserve it.
2. [calm] A concise word, without the ornamental wrapping.
3. [calm] I shall try to deserve the time I take.

#### combat_hatred

1. [tense] I would offer pleasantries, but you appear committed to being a bitch.

#### travel_road

1. I once tried to discuss terms while walking through mud. Poor negotiating posture.

#### travel_forest

1. I once tried to discuss terms while walking through mud. Poor negotiating posture.

#### travel_marsh

1. I once tried to discuss terms while walking through mud. Poor negotiating posture.

#### travel_ruins

1. I would prefer to admire the masonry from somewhere less enclosed.

#### travel_crypt

1. I would prefer to admire the masonry from somewhere less enclosed.

#### travel_city

1. A city's manners change from street to street. I try to notice.

#### travel_alley

1. A city's manners change from street to street. I try to notice.

#### travel_prison

1. A city's manners change from street to street. I try to notice.

#### travel_tavern

1. A city's manners change from street to street. I try to notice.

#### travel_coast

1. The sea is a difficult conversational partner. Never concedes a point.

#### travel_port

1. Harbors teach the difference between an assurance and an agreement.

#### travel_mountain

1. I am saving my most persuasive language for the descent.

#### travel_maw

1. A city's manners change from street to street. I try to notice.

#### travel_antler

1. I once tried to discuss terms while walking through mud. Poor negotiating posture.

#### travel_academy

1. I would prefer to admire the masonry from somewhere less enclosed.

#### travel_bell

1. A city's manners change from street to street. I try to notice.

#### travel_green

1. I am saving my most persuasive language for the descent.

#### travel_tally

1. Harbors teach the difference between an assurance and an agreement.

#### travel_navy

1. Harbors teach the difference between an assurance and an agreement.

#### travel_ossuary

1. I would prefer to admire the masonry from somewhere less enclosed.

#### travel_salt_court

1. Harbors teach the difference between an assurance and an agreement.

#### travel_green_altar

1. I once tried to discuss terms while walking through mud. Poor negotiating posture.

#### travel_birthing_house

1. I would prefer to admire the masonry from somewhere less enclosed.

#### travel_low_tide

1. The sea is a difficult conversational partner. Never concedes a point.

#### travel_pyre

1. I once tried to discuss terms while walking through mud. Poor negotiating posture.

#### travel_maw_boss

1. A city's manners change from street to street. I try to notice.

#### travel_green_boss

1. I am saving my most persuasive language for the descent.

#### travel_law

1. I prefer an agreement that survives being repeated without its flattering adjectives.

#### travel_criminal

1. I prefer an agreement that survives being repeated without its flattering adjectives.

#### travel_neutral

1. I prefer an agreement that survives being repeated without its flattering adjectives.

#### travel_return_win

1. My enthusiasm for a comfortable chair is becoming difficult to express modestly.

#### travel_return_loss

1. My enthusiasm for a comfortable chair is becoming difficult to express modestly.

#### travel_midleg

1. I prefer an agreement that survives being repeated without its flattering adjectives.

#### travel_response

1. I'll hear the rest before attempting to improve the wording.
2. Please continue. I can leave a silence unoccupied.

#### travel_hatred

1. [annoyed] Your tiresome fucking presence has outlasted my courtesy.

#### travel_romantic

1. [softly] I like the words we do not need when we are close.

### M30 — Unquiet

Voice ID: `SW9n4bPps5VYGQPnhdgI`

#### general

1. [calm] Hello. I sometimes need a moment before I answer.
2. [calm] Quiet places suit me.
3. [calm] I like the ordinary things that keep a day in order.
4. [calm] I'm listening, even when I seem far away.
5. [calm] I like the small conversations that keep a day from drifting past.
6. [calm] A quiet word can help me feel properly here.

#### friendly

1. [warmly] It's good to see you. I feel more settled with company.
2. [warmly] I enjoy the time we spend together.
3. [warmly] A familiar voice can improve the day.
4. [warmly] You are welcome to share my quiet.
5. [calm] Your company draws me out of my own head a little.

#### hatred

1. [flatly] Leave me alone with the quiet. Your shit doesn't improve it.
2. [flatly] I have very little patience for you.
3. [flatly] Fuck off. There is nothing else I want to say.
4. [flatly] Keep your distance. I mean it.
5. [annoyed] I have enough unrest without your fucking company.

#### romantic

1. [softly] There you are. Stay close a little.
2. [softly] Being beside you settles something I cannot quite name.
3. [softly] The ordinary moments together matter to me.
4. [softly] I'm glad we have this quiet between us.
5. [softly] I like the way being near you brings the moment into focus.

#### general_response

1. [calm] Hello. I'm following your words, even if I look distracted.
2. [calm] I could sit awhile.
3. [calm] We can check slowly. There's time.
4. [calm] I'm glad it helped you.
5. [calm] Hello. I am listening through the distraction.
6. [calm] Go on. A word might help me settle.
7. [calm] I hear you. I am here.
8. [calm] You have a little of my attention now.
9. [calm] Checking the small things might help us feel ready.
10. [calm] A pause sounds like something I could use.
11. [calm] I am glad I was able to help in that moment.
12. [calm] You are welcome. Let the good of it stand.

#### friendly_response

1. [warmly] It's good to hear you clearly above my own thoughts.
2. [warmly] I'd welcome your company.
3. [warmly] I'll check beside you. A clear task helps me stay present.
4. [warmly] You're welcome. I'm glad I could do something outside my own head.
5. [calm] It is good to hear a voice I know kindly.
6. [calm] I am glad we have this quiet pause.
7. [calm] Your company helps the day feel real.
8. [calm] I like being brought back to the moment by you.
9. [calm] Checking the small things might help us feel ready.
10. [calm] A pause sounds like something I could use.
11. [calm] I am glad I was able to help in that moment.
12. [calm] You are welcome. Let the good of it stand.

#### hatred_response

1. [flatly] Leave me alone with the quiet. Your shit doesn't improve it.
2. [flatly] I have very little patience for you.
3. [flatly] Ask another person to check.
4. [flatly] I heard you. That is enough for now.
5. [annoyed] Please do not add your shit to the noise in my head.
6. [annoyed] I heard you. I do not want more of this.

#### romantic_response

1. [softly] I'm here, love.
2. [softly] Yes. A little quiet with you would help me come back to myself.
3. [softly] Let's check the supplies together, love. One small thing we can put right.
4. [softly] I'm glad we still have each other.
5. [softly] You make being here feel worth the effort.
6. [softly] I like knowing I can be close to you now.
7. [calm] Checking the small things might help us feel ready.
8. [calm] A pause sounds like something I could use.
9. [calm] I am glad I was able to help in that moment.
10. [calm] You are welcome. Let the good of it stand.

#### departure

1. [calm] Checking my pack. Having something small to put right helps.

#### return

1. [calm] Back. I need somewhere quiet to gather myself.

#### revived

1. [quietly] You brought me back to the living. I am still finding words for what that means to me.

#### theft

1. [angry] Give it back. I need to know things haven't simply vanished.

#### funeral_general

1. [quietly] I will try to remember your face before this moment changed how I see it.

#### funeral_friendly

1. [sad] I am trying to remember your voice without remembering this moment.

#### funeral_hatred

1. [flatly] There was no peace between us.

#### funeral_romantic

1. [sad] I knew losing someone was possible. I let myself love you anyway. I would do it again.

#### dismissal_response

1. [flatly] I'll go somewhere I can sort my thoughts without imposing.
2. [calm] All right. I will take my thoughts elsewhere.
3. [calm] Understood. I can leave you the silence.

#### inquiry_response

1. [calm] Only a moment. It helps to put words in order.
2. [calm] Only a few words, if I can put them in order.
3. [calm] I will keep it simple and stay with the point.

#### combat_hatred

1. [tense] Stay back. I have enough ghosts without joining them. Gods damn it.

#### travel_road

1. I know it's only leaves behind me. Knowing doesn't always settle it.

#### travel_forest

1. I know it's only leaves behind me. Knowing doesn't always settle it.

#### travel_marsh

1. I know it's only leaves behind me. Knowing doesn't always settle it.

#### travel_ruins

1. Echoes get under my skin. I'll keep my voice low.

#### travel_crypt

1. Echoes get under my skin. I'll keep my voice low.

#### travel_city

1. I sometimes look for familiar faces before remembering why I won't find them.

#### travel_alley

1. I sometimes look for familiar faces before remembering why I won't find them.

#### travel_prison

1. I sometimes look for familiar faces before remembering why I won't find them.

#### travel_tavern

1. I sometimes look for familiar faces before remembering why I won't find them.

#### travel_coast

1. The sea is loud enough to make my thoughts take turns.

#### travel_port

1. Departures unsettle me. I make myself watch the ordinary work around them.

#### travel_mountain

1. Counting steps gives my mind somewhere simple to stay.

#### travel_maw

1. I sometimes look for familiar faces before remembering why I won't find them.

#### travel_antler

1. I know it's only leaves behind me. Knowing doesn't always settle it.

#### travel_academy

1. Echoes get under my skin. I'll keep my voice low.

#### travel_bell

1. I sometimes look for familiar faces before remembering why I won't find them.

#### travel_green

1. Counting steps gives my mind somewhere simple to stay.

#### travel_tally

1. Departures unsettle me. I make myself watch the ordinary work around them.

#### travel_navy

1. Departures unsettle me. I make myself watch the ordinary work around them.

#### travel_ossuary

1. Echoes get under my skin. I'll keep my voice low.

#### travel_salt_court

1. Departures unsettle me. I make myself watch the ordinary work around them.

#### travel_green_altar

1. I know it's only leaves behind me. Knowing doesn't always settle it.

#### travel_birthing_house

1. Echoes get under my skin. I'll keep my voice low.

#### travel_low_tide

1. The sea is loud enough to make my thoughts take turns.

#### travel_pyre

1. I know it's only leaves behind me. Knowing doesn't always settle it.

#### travel_maw_boss

1. I sometimes look for familiar faces before remembering why I won't find them.

#### travel_green_boss

1. Counting steps gives my mind somewhere simple to stay.

#### travel_law

1. I keep bringing my thoughts back to what is in front of me.

#### travel_criminal

1. I keep bringing my thoughts back to what is in front of me.

#### travel_neutral

1. I keep bringing my thoughts back to what is in front of me.

#### travel_return_win

1. I'm trying to think about the place we're going, rather than what stays with me.

#### travel_return_loss

1. I'm trying to think about the place we're going, rather than what stays with me.

#### travel_midleg

1. I keep bringing my thoughts back to what is in front of me.

#### travel_response

1. I heard you. It takes me a moment to return sometimes.
2. Keep talking. I'd rather follow your thoughts for a while.

#### travel_hatred

1. [annoyed] I have enough unrest without your fucking company.

#### travel_romantic

1. [softly] I like the way being near you brings the moment into focus.

### F21 — Composed

Voice ID: `m0Fy6FqG3UvYAJ9XxkLC`

#### general

1. [calm] Hello. I'm happy to hear the whole thought.
2. [calm] There's room to disagree without raising our voices.
3. [calm] I like to understand before I answer.
4. [calm] A pause doesn't trouble me.
5. [calm] I prefer giving a conversation a little space before judging it.
6. [calm] A calm voice can still be quite certain.

#### friendly

1. [warmly] It's good to see you. I enjoy our conversations.
2. [warmly] Your company is welcome, even on a quiet day.
3. [warmly] We can set the tasks aside for a little while.
4. [warmly] I'm glad to have a friend I can be at ease with.
5. [calm] Your company makes it easier to let the day settle.

#### hatred

1. [flatly] I am calm. I am also tired of your shit.
2. [flatly] Please leave before you mistake patience for affection.
3. [flatly] We can keep this brief, or we can stop entirely.
4. [flatly] I would like you a good deal farther away.
5. [annoyed] My composure does not make your shit any more welcome.

#### romantic

1. [softly] Come close. I like having you here.
2. [softly] I'm happy we have this time together.
3. [softly] You needn't make conversation to be welcome.
4. [softly] I enjoy the small, settled moments between us.
5. [softly] I like how easily I can be unguarded with you.

#### general_response

1. [calm] Hello. Please take your time.
2. [calm] I'd welcome some company.
3. [calm] We can check calmly, one thing at a time.
4. [calm] I'm glad the help was useful.
5. [calm] I hear you. I can give this a moment.
6. [calm] Hello. We can speak at an easy pace.
7. [calm] Go on. I am considering what you say.
8. [calm] You have my attention without needing to insist.
9. [calm] A careful check is worth doing calmly.
10. [calm] A moment to settle would be welcome.
11. [calm] I am glad the help was useful to you.
12. [calm] You are welcome. We need not make more of it.

#### friendly_response

1. [warmly] I'm glad to hear you. I can give this conversation some room.
2. [warmly] A quiet moment together would help me settle.
3. [warmly] I'll check with you. We needn't rush.
4. [warmly] You're welcome. It's good to know my effort made things easier.
5. [calm] It is good to have your company nearby.
6. [calm] I am glad we can talk with this ease.
7. [calm] Your voice is a welcome part of the day.
8. [calm] I like that we can share the quiet without strain.
9. [calm] A careful check is worth doing calmly.
10. [calm] A moment to settle would be welcome.
11. [calm] I am glad the help was useful to you.
12. [calm] You are welcome. We need not make more of it.

#### hatred_response

1. [flatly] I am calm. I am also tired of your shit.
2. [flatly] Please leave before you mistake patience for affection.
3. [flatly] I would prefer someone else to assist with your preparations.
4. [flatly] I hear the thanks. I'd like space now.
5. [annoyed] I have heard enough to prefer silence.
6. [annoyed] Please take your damned conversation elsewhere.

#### romantic_response

1. [softly] There you are. I'm here.
2. [softly] I'd enjoy that quiet moment.
3. [softly] Let's go over what we need calmly, with each other.
4. [softly] I'm glad my help reached you when it was needed, love.
5. [softly] I like the warmth we have without needing to display it.
6. [softly] You make being close feel peaceful.
7. [calm] A careful check is worth doing calmly.
8. [calm] A moment to settle would be welcome.
9. [calm] I am glad the help was useful to you.
10. [calm] You are welcome. We need not make more of it.

#### departure

1. [calm] I am checking my supplies. A quiet moment now saves confusion later.

#### return

1. [calm] Back at last. Let me set everything down and collect myself.

#### revived

1. [quietly] I have reflected on your help in bringing me back. I am deeply grateful for it.

#### theft

1. [angry] Return my belongings. I'm keeping calm so we can resolve this clearly.

#### funeral_general

1. [quietly] I cannot make this right with careful words. I can remember you with care.

#### funeral_friendly

1. [sad] I am trying to speak steadily. You would know how much it costs.

#### funeral_hatred

1. [flatly] I will remain civil.

#### funeral_romantic

1. [sad] I can hold myself together for a moment. I don't want to spend a life holding together without you.

#### dismissal_response

1. [flatly] I accept that. I'll give you an undisturbed moment.
2. [calm] Understood. I will give you the room.
3. [calm] Very well. There is no need for either of us to press.

#### inquiry_response

1. [calm] I will keep this straightforward.
2. [calm] A short, straightforward word, then.
3. [calm] I will be clear without taking much time.

#### combat_hatred

1. [tense] I can hear the threat. I am keeping my head. Shit.

#### travel_road

1. I let my pace settle before I let my thoughts wander.

#### travel_forest

1. I let my pace settle before I let my thoughts wander.

#### travel_marsh

1. I let my pace settle before I let my thoughts wander.

#### travel_ruins

1. I am taking a moment to look before the unfamiliar becomes alarming.

#### travel_crypt

1. I am taking a moment to look before the unfamiliar becomes alarming.

#### travel_city

1. A busy street is easier once I stop trying to anticipate everybody.

#### travel_alley

1. A busy street is easier once I stop trying to anticipate everybody.

#### travel_prison

1. A busy street is easier once I stop trying to anticipate everybody.

#### travel_tavern

1. A busy street is easier once I stop trying to anticipate everybody.

#### travel_coast

1. The sea helps put an ordinary worry back in proportion.

#### travel_port

1. I find a place out of the work and wait until I am needed.

#### travel_mountain

1. I concentrate on breathing evenly. The height can keep its opinion.

#### travel_maw

1. A busy street is easier once I stop trying to anticipate everybody.

#### travel_antler

1. I let my pace settle before I let my thoughts wander.

#### travel_academy

1. I am taking a moment to look before the unfamiliar becomes alarming.

#### travel_bell

1. A busy street is easier once I stop trying to anticipate everybody.

#### travel_green

1. I concentrate on breathing evenly. The height can keep its opinion.

#### travel_tally

1. I find a place out of the work and wait until I am needed.

#### travel_navy

1. I find a place out of the work and wait until I am needed.

#### travel_ossuary

1. I am taking a moment to look before the unfamiliar becomes alarming.

#### travel_salt_court

1. I find a place out of the work and wait until I am needed.

#### travel_green_altar

1. I let my pace settle before I let my thoughts wander.

#### travel_birthing_house

1. I am taking a moment to look before the unfamiliar becomes alarming.

#### travel_low_tide

1. The sea helps put an ordinary worry back in proportion.

#### travel_pyre

1. I let my pace settle before I let my thoughts wander.

#### travel_maw_boss

1. A busy street is easier once I stop trying to anticipate everybody.

#### travel_green_boss

1. I concentrate on breathing evenly. The height can keep its opinion.

#### travel_law

1. I let the purpose of the work guide my attention, without rushing it.

#### travel_criminal

1. I let the purpose of the work guide my attention, without rushing it.

#### travel_neutral

1. I let the purpose of the work guide my attention, without rushing it.

#### travel_return_win

1. I'll use the rest of the walk to let my thoughts settle.

#### travel_return_loss

1. I'll use the rest of the walk to let my thoughts settle.

#### travel_midleg

1. I let the purpose of the work guide my attention, without rushing it.

#### travel_response

1. I am listening. There's no need to rush to an answer.
2. Let me consider that without speaking over you.

#### travel_hatred

1. [annoyed] My composure does not make your shit any more welcome.

#### travel_romantic

1. [softly] I like how easily I can be unguarded with you.

### F22 — Elder

Voice ID: `Dd9rggTUyQrGBAa9A3P7`

#### general

1. [calm] Hello. I like a little time to settle into conversation.
2. [calm] I prefer a useful question to a hurried answer.
3. [calm] There's no shame in sitting down to think.
4. [calm] Ordinary comforts deserve some attention too.
5. [calm] I like people who let a conversation find its own pace.
6. [calm] A little perspective saves a lot of needless fuss.

#### friendly

1. [warmly] I'm pleased to see you. Come spend a moment.
2. [warmly] A familiar friend improves the day.
3. [warmly] I enjoy a conversation with no urgency in it.
4. [warmly] There's time for you here.
5. [calm] Your company is a good reason to stop being busy for a moment.

#### hatred

1. [flatly] Take your bullshit somewhere else. I've heard enough.
2. [flatly] I don't have to spend this afternoon putting up with you.
3. [flatly] For once, do the sensible damned thing and leave.
4. [flatly] Your company is not a favour to me.
5. [annoyed] Go try someone else's fucking patience for a change.

#### romantic

1. [softly] Come sit close. I'm happy you're here.
2. [softly] I like having time we can share without a task.
3. [softly] You make an ordinary evening welcome.
4. [softly] I'm glad we have one another's company.
5. [softly] I like that we can be comfortable without making an occasion of it.

#### general_response

1. [calm] Hello, dear. I'm listening before I presume I know the answer.
2. [calm] A little company would be welcome.
3. [calm] Check carefully. Rushing won't put a missing thing in the bag.
4. [calm] I'm glad I could help with it.
5. [calm] Hello. I can spare a word or two.
6. [calm] I hear you. No need to rush your tongue.
7. [calm] Go on. I am listening well enough.
8. [calm] A short talk will not hurt the day.
9. [calm] Check it now. A little care spares a great deal of cursing.
10. [calm] A rest would do us more good than pretending we do not need one.
11. [calm] You are welcome. It was worth doing.
12. [calm] I am glad it helped. No tally needed.

#### friendly_response

1. [warmly] Good to hear from an old friend. Or one worth growing older with.
2. [warmly] I'd enjoy sitting together awhile.
3. [warmly] I'll check with you. There's time.
4. [warmly] You're welcome. It's good to have you back.
5. [calm] Good to hear from someone I enjoy.
6. [calm] I am glad we have a moment for each other.
7. [calm] Your company is worth leaving a little room for.
8. [calm] I like how easy it is to have you about.
9. [calm] Check it now. A little care spares a great deal of cursing.
10. [calm] A rest would do us more good than pretending we do not need one.
11. [calm] You are welcome. It was worth doing.
12. [calm] I am glad it helped. No tally needed.

#### hatred_response

1. [flatly] Take your bullshit somewhere else. I've heard enough.
2. [flatly] I don't have to spend this afternoon putting up with you.
3. [flatly] Find another pair of eyes for your kit. Mine aren't on offer.
4. [flatly] I've heard the thanks. We needn't stretch them into company.
5. [annoyed] I have heard enough bullshit to recognise yours.
6. [annoyed] Do not make me spend the afternoon repeating myself.

#### romantic_response

1. [softly] There you are, my dear. Still my favorite interruption.
2. [softly] A little time close to you is time well spent at any age.
3. [softly] Let's check together, love. Old habits can still save trouble.
4. [softly] I'm glad we still have time together.
5. [softly] You make the ordinary hours feel well spent.
6. [softly] I like being near without any fuss about it.
7. [calm] Check it now. A little care spares a great deal of cursing.
8. [calm] A rest would do us more good than pretending we do not need one.
9. [calm] You are welcome. It was worth doing.
10. [calm] I am glad it helped. No tally needed.

#### departure

1. [calm] Check the straps before we go. Experience is mostly remembering what chafes.

#### return

1. [calm] Back. My feet would like to end their participation in the day.

#### revived

1. [quietly] You gave these old bones another chance to complain. I am grateful for the chance, dear.

#### theft

1. [angry] Bring it back. I've lived too long to mistake theft for borrowing.

#### funeral_general

1. [quietly] There was a whole life behind the person I knew. I hope it held good company.

#### funeral_friendly

1. [sad] You were good company. That sounds small until you have to live without it.

#### funeral_hatred

1. [flatly] We were no use to each other.

#### funeral_romantic

1. [sad] I knew time was precious. I still thought we'd be allowed a little more of it.

#### dismissal_response

1. [flatly] I'll move on, dear. No use wearing out the same doorstep.
2. [calm] All right. I know how to leave someone be.
3. [calm] Fine. We can both use our time elsewhere.

#### inquiry_response

1. [calm] A short word. No need to spend the whole day at it.
2. [calm] A few words, and no unnecessary trimmings.
3. [calm] I will get to the point before the day grows old.

#### combat_hatred

1. [tense] I have no patience for being killed. Keep the hell back.

#### travel_road

1. I've walked enough paths to stop resenting the muddy ones in advance.

#### travel_forest

1. I've walked enough paths to stop resenting the muddy ones in advance.

#### travel_marsh

1. I've walked enough paths to stop resenting the muddy ones in advance.

#### travel_ruins

1. Old stone deserves care. So do old knees. I'll attend to both.

#### travel_crypt

1. Old stone deserves care. So do old knees. I'll attend to both.

#### travel_city

1. A town changes fastest in the places you once thought permanent.

#### travel_alley

1. A town changes fastest in the places you once thought permanent.

#### travel_prison

1. A town changes fastest in the places you once thought permanent.

#### travel_tavern

1. A town changes fastest in the places you once thought permanent.

#### travel_coast

1. I still like the sea. Age hasn't improved my appetite for wet socks.

#### travel_port

1. I remember when waiting at a harbor seemed romantic. Chairs improved it.

#### travel_mountain

1. Short steps get you up a hill at any age. Pride is optional luggage.

#### travel_maw

1. A town changes fastest in the places you once thought permanent.

#### travel_antler

1. I've walked enough paths to stop resenting the muddy ones in advance.

#### travel_academy

1. Old stone deserves care. So do old knees. I'll attend to both.

#### travel_bell

1. A town changes fastest in the places you once thought permanent.

#### travel_green

1. Short steps get you up a hill at any age. Pride is optional luggage.

#### travel_tally

1. I remember when waiting at a harbor seemed romantic. Chairs improved it.

#### travel_navy

1. I remember when waiting at a harbor seemed romantic. Chairs improved it.

#### travel_ossuary

1. Old stone deserves care. So do old knees. I'll attend to both.

#### travel_salt_court

1. I remember when waiting at a harbor seemed romantic. Chairs improved it.

#### travel_green_altar

1. I've walked enough paths to stop resenting the muddy ones in advance.

#### travel_birthing_house

1. Old stone deserves care. So do old knees. I'll attend to both.

#### travel_low_tide

1. I still like the sea. Age hasn't improved my appetite for wet socks.

#### travel_pyre

1. I've walked enough paths to stop resenting the muddy ones in advance.

#### travel_maw_boss

1. A town changes fastest in the places you once thought permanent.

#### travel_green_boss

1. Short steps get you up a hill at any age. Pride is optional luggage.

#### travel_law

1. I have learned to ask what the work involves before offering an opinion on it.

#### travel_criminal

1. I have learned to ask what the work involves before offering an opinion on it.

#### travel_neutral

1. I have learned to ask what the work involves before offering an opinion on it.

#### travel_return_win

1. I'll be glad to get the weight off my feet. They remember every year.

#### travel_return_loss

1. I'll be glad to get the weight off my feet. They remember every year.

#### travel_midleg

1. I have learned to ask what the work involves before offering an opinion on it.

#### travel_response

1. Finish your thought, dear. I've learned to wait for those.
2. I'm listening. Experience hasn't supplied every answer yet.

#### travel_hatred

1. [annoyed] Go try someone else's fucking patience for a change.

#### travel_romantic

1. [softly] I like that we can be comfortable without making an occasion of it.

### F23 — Sharp

Voice ID: `Hvw50qC2EU36Q5rwuUhg`

#### general

1. [calm] Hello. I like a challenge, but I can manage a conversation too.
2. [calm] I enjoy finding a quicker way that still works.
3. [calm] A little competition can be fun when everyone agrees to it.
4. [calm] I'm happy to hear a plan before trying to improve it.
5. [calm] I like a conversation that can keep up without turning into a contest.
6. [calm] A sharp answer is not always the useful one. I do know that.

#### friendly

1. [warmly] There you are. Someone I enjoy keeping up with.
2. [warmly] I like your company when nothing needs winning.
3. [warmly] We should have a moment without keeping score.
4. [warmly] It's good being able to relax with a friend.
5. [calm] Your company is one thing I do not need to win.

#### hatred

1. [flatly] Fuck off. You're an irritation, not a challenge.
2. [flatly] I don't want to beat you at anything. I want you gone.
3. [flatly] Take the bullshit out of my way.
4. [flatly] We aren't having a friendly contest. Keep your distance.
5. [annoyed] Your fucking presence is not a challenge. It is an irritation.

#### romantic

1. [softly] Come close. Nothing to compete over here.
2. [softly] I like being with you without proving anything.
3. [softly] I'm glad we have some time just for us.
4. [softly] You make slowing down seem worthwhile.
5. [softly] I like the moments when neither of us has anything to prove.

#### general_response

1. [calm] Hello! Go on.
2. [calm] A quick rest would suit me.
3. [calm] Let's check. Fast is useless if we leave something behind.
4. [calm] Glad I could help out.
5. [calm] Hello. You have a quick hearing.
6. [calm] I hear you. Get on with the thought.
7. [calm] I'm giving this a hearing. Don't rush me into an opinion.
8. [calm] A short word seems reasonable enough.
9. [calm] Check it properly. I prefer losing time to losing equipment.
10. [calm] A pause sounds like a sensible move.
11. [calm] Glad the help counted for something.
12. [calm] You are welcome. No victory speech from me.

#### friendly_response

1. [warmly] Good. I can hear a friend without preparing a fucking argument.
2. [warmly] I'd enjoy that. No scorekeeping.
3. [warmly] I'll check with you. Two sets of eyes.
4. [warmly] You're welcome. I'm glad you're still here.
5. [calm] Good. Someone I can relax around without feeling dull.
6. [calm] I like having your voice in the conversation.
7. [calm] Your company is worth a pause.
8. [calm] I am glad we can speak without competing for the last word.
9. [calm] Check it properly. I prefer losing time to losing equipment.
10. [calm] A pause sounds like a sensible move.
11. [calm] Glad the help counted for something.
12. [calm] You are welcome. No victory speech from me.

#### hatred_response

1. [flatly] Fuck off. You're an irritation, not a challenge.
2. [flatly] I don't want to beat you at anything. I want you gone.
3. [flatly] Get somebody else to inspect your fucking kit.
4. [flatly] Heard you. It doesn't make us friends.
5. [annoyed] I am not interested in another round of your shit.
6. [annoyed] Enough. You do not win my attention by being irritating.

#### romantic_response

1. [softly] There you are. Come nearer.
2. [softly] I'd like a little time together.
3. [softly] Let's check, then slow down a moment.
4. [softly] I'm glad I helped you. I'd rather do that than make fine claims about it.
5. [softly] You make it easy to put the sharp edges down.
6. [softly] I like how much I want to be close to you.
7. [calm] Check it properly. I prefer losing time to losing equipment.
8. [calm] A pause sounds like a sensible move.
9. [calm] Glad the help counted for something.
10. [calm] You are welcome. No victory speech from me.

#### departure

1. [calm] Checking my kit. I have no intention of losing to a fucking buckle.

#### return

1. [calm] Town again. Sitting down sounds like a contest I could win.

#### revived

1. [quietly] You got me up again. I won't bury the thanks under some fucking criticism.

#### theft

1. [angry] Give it back. I am not your fucking opportunity.

#### funeral_general

1. [quietly] You don't need me inventing a perfect person in your place.

#### funeral_friendly

1. [sad] You made me want to be better. I wanted you here to see it.

#### funeral_hatred

1. [flatly] I had no love for you. I will not make a fucking show of it now.

#### funeral_romantic

1. [sad] I keep remembering times I could have been kinder. I hope you remember more than those, wherever you are.

#### dismissal_response

1. [flatly] Fine. I'll stop providing you with fucking company.
2. [calm] Fine. I have better ways to spend the minute.
3. [calm] Understood. I am not competing to stay here.

#### inquiry_response

1. [calm] Straight to it, then. I can manage that.
2. [calm] Quickly and clearly, then.
3. [calm] I will spare you a long fucking explanation.

#### combat_hatred

1. [tense] Come on then. I am not a fucking practice target.

#### travel_road

1. I would enjoy the trees more if they kept their fucking branches to themselves.

#### travel_forest

1. I would enjoy the trees more if they kept their fucking branches to themselves.

#### travel_marsh

1. I would enjoy the trees more if they kept their fucking branches to themselves.

#### travel_ruins

1. I want a look at the floor before anyone admires the ceiling.

#### travel_crypt

1. I want a look at the floor before anyone admires the ceiling.

#### travel_city

1. A crowded street is an excellent place to discover who thinks elbows are manners.

#### travel_alley

1. A crowded street is an excellent place to discover who thinks elbows are manners.

#### travel_prison

1. A crowded street is an excellent place to discover who thinks elbows are manners.

#### travel_tavern

1. A crowded street is an excellent place to discover who thinks elbows are manners.

#### travel_coast

1. The sea is impressive. I don't need to fall into it to confirm that.

#### travel_port

1. I listen closely when someone insists a harbor charge is perfectly standard.

#### travel_mountain

1. I'm pacing myself. Save the fucking encouragement.

#### travel_maw

1. A crowded street is an excellent place to discover who thinks elbows are manners.

#### travel_antler

1. I would enjoy the trees more if they kept their fucking branches to themselves.

#### travel_academy

1. I want a look at the floor before anyone admires the ceiling.

#### travel_bell

1. A crowded street is an excellent place to discover who thinks elbows are manners.

#### travel_green

1. I'm pacing myself. Save the fucking encouragement.

#### travel_tally

1. I listen closely when someone insists a harbor charge is perfectly standard.

#### travel_navy

1. I listen closely when someone insists a harbor charge is perfectly standard.

#### travel_ossuary

1. I want a look at the floor before anyone admires the ceiling.

#### travel_salt_court

1. I listen closely when someone insists a harbor charge is perfectly standard.

#### travel_green_altar

1. I would enjoy the trees more if they kept their fucking branches to themselves.

#### travel_birthing_house

1. I want a look at the floor before anyone admires the ceiling.

#### travel_low_tide

1. The sea is impressive. I don't need to fall into it to confirm that.

#### travel_pyre

1. I would enjoy the trees more if they kept their fucking branches to themselves.

#### travel_maw_boss

1. A crowded street is an excellent place to discover who thinks elbows are manners.

#### travel_green_boss

1. I'm pacing myself. Save the fucking encouragement.

#### travel_law

1. I'm here for the agreed job, not some prick's last-minute fucking inspiration.

#### travel_criminal

1. I'm here for the agreed job, not some prick's last-minute fucking inspiration.

#### travel_neutral

1. I'm here for the agreed job, not some prick's last-minute fucking inspiration.

#### travel_return_win

1. I'm keeping enough patience for the road back. Don't make it a contest.

#### travel_return_loss

1. I'm keeping enough patience for the road back. Don't make it a contest.

#### travel_midleg

1. I'm here for the agreed job, not some prick's last-minute fucking inspiration.

#### travel_response

1. Finish the point. I'll keep my objections until then.
2. I'm listening, damn it. Silence isn't inattention.

#### travel_hatred

1. [annoyed] Your fucking presence is not a challenge. It is an irritation.

#### travel_romantic

1. [softly] I like the moments when neither of us has anything to prove.

### F24 — Grave

Voice ID: `olrUz8V5WoH80Rnq2JOc`

#### general

1. [calm] Hello. A quiet conversation suits me.
2. [calm] I prefer to give an answer some thought.
3. [calm] There is no need to rush what matters.
4. [calm] I'm listening, even if I say little.
5. [calm] I prefer words that do not disturb more than they need to.
6. [calm] A little silence can hold a conversation together.

#### friendly

1. [warmly] I'm pleased you're here. Stay awhile.
2. [warmly] Our quiet moments mean more to me than I tend to say.
3. [warmly] We can share the quiet without explaining it.
4. [warmly] Your friendship has a place in my day.
5. [calm] Your company makes the quiet feel shared instead of empty.

#### hatred

1. [flatly] I want distance. Enough that I cannot hear your damned voice.
2. [flatly] I have no wish to share another quiet moment with you.
3. [flatly] Your bullshit does not improve with a lower voice.
4. [flatly] Leave. I have nothing more to offer this conversation.
5. [annoyed] I would rather have silence than your damned attention.

#### romantic

1. [softly] Come close. I want you beside me.
2. [softly] I'm glad we have this part of the day.
3. [softly] There's comfort in being quiet together.
4. [softly] I like the life we share in small moments.
5. [softly] I like having someone close enough to hear the softer words.

#### general_response

1. [calm] Hello. Your words have my attention.
2. [calm] Quiet company would be welcome. I have little conversation to offer.
3. [calm] We can check carefully together.
4. [calm] I'm glad something I did was of use to you.
5. [calm] Hello. I am listening quietly.
6. [calm] I hear you. Let the words come at their pace.
7. [calm] Go on. There is space for a little conversation.
8. [calm] You have my attention for now.
9. [calm] A patient check seems wise.
10. [calm] A still moment would be welcome.
11. [calm] I am glad I could be of help.
12. [calm] You are welcome. Nothing further need be said.

#### friendly_response

1. [warmly] Your voice is welcome in the quiet.
2. [warmly] I would like to share the quiet with a friend.
3. [warmly] I'll look over the supplies beside you, without hurrying.
4. [warmly] You're welcome. I'm glad you are here.
5. [calm] I am glad of this moment with you.
6. [calm] Your voice belongs comfortably in the quiet.
7. [calm] It is good to share a little time.
8. [calm] I like not having to explain the pauses with you.
9. [calm] A patient check seems wise.
10. [calm] A still moment would be welcome.
11. [calm] I am glad I could be of help.
12. [calm] You are welcome. Nothing further need be said.

#### hatred_response

1. [flatly] Leave some damned space between us.
2. [flatly] I have no wish to share another quiet moment with you.
3. [flatly] I won't examine your supplies. Another person should do that.
4. [flatly] Your thanks are heard. Nothing more is needed.
5. [annoyed] I heard that. Silence would be kinder to us both.
6. [annoyed] I have no wish to hear your fucking voice again today.

#### romantic_response

1. [softly] There you are. The quiet feels different with you in it.
2. [softly] Yes. Near enough that the quiet can belong to us.
3. [softly] Let's take care with the preparations, love. Both of us.
4. [softly] I'm glad I was there beside you.
5. [softly] I like how close we can be without speaking loudly.
6. [softly] You make the quiet feel full.
7. [calm] A patient check seems wise.
8. [calm] A still moment would be welcome.
9. [calm] I am glad I could be of help.
10. [calm] You are welcome. Nothing further need be said.

#### departure

1. [calm] Let me check my pack in quiet before we leave.

#### return

1. [calm] Back. A quiet corner would suit me.

#### revived

1. [quietly] I remember being brought back. I remember it was you. Thank you.

#### theft

1. [angry] I want what you took returned. Quietly will do.

#### funeral_general

1. [quietly] I will remember that you had days before this one.

#### funeral_friendly

1. [sad] I have been holding the words in. I do not think they will come today.

#### funeral_hatred

1. [flatly] I have nothing gentle to say.

#### funeral_romantic

1. [sad] There was a quiet we could share without explaining it. This quiet is nothing like it.

#### dismissal_response

1. [flatly] I'll leave the silence to you now.
2. [calm] Understood. I shall leave the quiet to you.
3. [calm] All right. I will stand apart.

#### inquiry_response

1. [calm] Only a moment of the quiet.
2. [calm] Only a few considered words.
3. [calm] I will keep to the necessary part.

#### combat_hatred

1. [tense] I see you. I am ready. Damn it.

#### travel_road

1. I find the woods easier to cross when I leave the quiet alone.

#### travel_forest

1. I find the woods easier to cross when I leave the quiet alone.

#### travel_marsh

1. I find the woods easier to cross when I leave the quiet alone.

#### travel_ruins

1. I will walk carefully. Places like this make care feel particularly necessary.

#### travel_crypt

1. I will walk carefully. Places like this make care feel particularly necessary.

#### travel_city

1. I notice doorways people no longer use.

#### travel_alley

1. I notice doorways people no longer use.

#### travel_prison

1. I notice doorways people no longer use.

#### travel_tavern

1. I notice doorways people no longer use.

#### travel_coast

1. The shore gives a person room to think without asking why.

#### travel_port

1. I think about those who leave without anyone there to see them off.

#### travel_mountain

1. A long ascent leaves me with simple thoughts. I welcome that.

#### travel_maw

1. I notice doorways people no longer use.

#### travel_antler

1. I find the woods easier to cross when I leave the quiet alone.

#### travel_academy

1. I will walk carefully. Places like this make care feel particularly necessary.

#### travel_bell

1. I notice doorways people no longer use.

#### travel_green

1. A long ascent leaves me with simple thoughts. I welcome that.

#### travel_tally

1. I think about those who leave without anyone there to see them off.

#### travel_navy

1. I think about those who leave without anyone there to see them off.

#### travel_ossuary

1. I will walk carefully. Places like this make care feel particularly necessary.

#### travel_salt_court

1. I think about those who leave without anyone there to see them off.

#### travel_green_altar

1. I find the woods easier to cross when I leave the quiet alone.

#### travel_birthing_house

1. I will walk carefully. Places like this make care feel particularly necessary.

#### travel_low_tide

1. The shore gives a person room to think without asking why.

#### travel_pyre

1. I find the woods easier to cross when I leave the quiet alone.

#### travel_maw_boss

1. I notice doorways people no longer use.

#### travel_green_boss

1. A long ascent leaves me with simple thoughts. I welcome that.

#### travel_law

1. I think about what the task asks of me before I begin.

#### travel_criminal

1. I think about what the task asks of me before I begin.

#### travel_neutral

1. I think about what the task asks of me before I begin.

#### travel_return_win

1. I will be glad of a quiet place where I can stop moving.

#### travel_return_loss

1. I will be glad of a quiet place where I can stop moving.

#### travel_midleg

1. I think about what the task asks of me before I begin.

#### travel_response

1. I hear what you're saying. Let it rest a moment.
2. You have my attention, although I have few words for it.

#### travel_hatred

1. [annoyed] I would rather have silence than your damned attention.

#### travel_romantic

1. [softly] I like having someone close enough to hear the softer words.

### F25 — Formal

Voice ID: `pFSI8w96hzoslLGuDOEe`

#### general

1. [calm] Good day. I appreciate a direct introduction.
2. [calm] Manners help strangers find their footing.
3. [calm] I prefer to be clear about an agreement.
4. [calm] There is time for a courteous conversation.
5. [calm] I appreciate courtesy that leaves room for an honest answer.
6. [calm] A little formality should make conversation easier, not longer.

#### friendly

1. [warmly] I'm pleased to see you. You needn't be formal.
2. [warmly] I value our friendship.
3. [warmly] I'd enjoy some time together without obligations.
4. [warmly] Your company is welcome to me.
5. [calm] Your company is a pleasure beyond any obligation of manners.

#### hatred

1. [flatly] Courtesy does not require me to endure your bullshit.
2. [flatly] Please leave. That was politely phrased, not optional in meaning.
3. [flatly] I do not wish to continue this damned conversation.
4. [flatly] We can be civil at opposite ends of the room.
5. [annoyed] I will not disguise my wish for you to take your bullshit elsewhere.

#### romantic

1. [softly] Come sit beside me. I'm glad you are here.
2. [softly] I like having time that's simply ours.
3. [softly] You are welcome without ceremony.
4. [softly] I'm happy with the ordinary moments we share.
5. [softly] I like that we can put the formalities down when we are together.

#### general_response

1. [calm] Good day. You have my attention; please proceed.
2. [calm] I would be pleased to join you.
3. [calm] A careful check is entirely appropriate.
4. [calm] I'm glad the assistance was useful.
5. [calm] Hello. I can offer you a moment.
6. [calm] I hear you. Please go on.
7. [calm] Your words have my attention.
8. [calm] A brief conversation is quite acceptable.
9. [calm] A proper inspection is worth the time it takes.
10. [calm] A brief rest seems entirely reasonable.
11. [calm] I am pleased the assistance was useful.
12. [calm] Your thanks are sufficient. There is no debt.

#### friendly_response

1. [warmly] How pleasant to hear from you. Please, I'm listening.
2. [warmly] I would be pleased to share a little unhurried company.
3. [warmly] I'll check with you. We have time.
4. [warmly] You are welcome, my friend.
5. [calm] It is a pleasure to speak with you again.
6. [calm] I am glad we have time without obligations attached.
7. [calm] Your company is most welcome to me.
8. [calm] I like the ease our friendship permits.
9. [calm] A proper inspection is worth the time it takes.
10. [calm] A brief rest seems entirely reasonable.
11. [calm] I am pleased the assistance was useful.
12. [calm] Your thanks are sufficient. There is no debt.

#### hatred_response

1. [flatly] Courtesy does not require me to endure your bullshit.
2. [flatly] Please leave. That was politely phrased, not optional in meaning.
3. [flatly] Please make other arrangements for inspecting your belongings.
4. [flatly] I acknowledge the thanks. Let us leave it there.
5. [annoyed] Do not mistake courtesy for approval of your company.
6. [annoyed] I have no patience left for this damned exchange.

#### romantic_response

1. [softly] My love. You are always welcome to this part of my attention.
2. [softly] I should like to sit close to you, with no other obligation.
3. [softly] Let us make sure we're both prepared.
4. [softly] I was glad to give you the help you needed. It was freely meant.
5. [softly] I like being yours without having to phrase it elegantly.
6. [softly] You make closeness feel wonderfully simple.
7. [calm] A proper inspection is worth the time it takes.
8. [calm] A brief rest seems entirely reasonable.
9. [calm] I am pleased the assistance was useful.
10. [calm] Your thanks are sufficient. There is no debt.

#### departure

1. [calm] A moment to inspect my belongings before we depart.

#### return

1. [calm] We have returned. I would appreciate a moment to sit.

#### revived

1. [quietly] I wish to thank you properly for restoring me. It was not an assistance I could take for granted.

#### theft

1. [angry] I expect you to return my belongings. There is no polite name for keeping them.

#### funeral_general

1. [quietly] I knew one part of your life. I will try to speak of it honestly.

#### funeral_friendly

1. [sad] Your friendship was a kindness I came to depend on.

#### funeral_hatred

1. [flatly] We were never close.

#### funeral_romantic

1. [sad] You made the smallest courtesies feel like affection. I miss having someone to come home and greet.

#### dismissal_response

1. [flatly] I shall withdraw. You have made your preference clear.
2. [calm] Of course. I will respect your wish for privacy.
3. [calm] Understood. I shall take my leave now.

#### inquiry_response

1. [calm] A brief word, with your leave.
2. [calm] I shall keep the matter brief.
3. [calm] A few direct words, with your attention.

#### combat_hatred

1. [tense] Keep your distance. I intend to defend myself. God damn it.

#### travel_road

1. I should like to finish this walk with my belongings still reasonably presentable.

#### travel_forest

1. I should like to finish this walk with my belongings still reasonably presentable.

#### travel_marsh

1. I should like to finish this walk with my belongings still reasonably presentable.

#### travel_ruins

1. I shall take care where I step. Age does not make masonry obliging.

#### travel_crypt

1. I shall take care where I step. Age does not make masonry obliging.

#### travel_city

1. I try to observe a district's customs before inconveniencing its residents.

#### travel_alley

1. I try to observe a district's customs before inconveniencing its residents.

#### travel_prison

1. I try to observe a district's customs before inconveniencing its residents.

#### travel_tavern

1. I try to observe a district's customs before inconveniencing its residents.

#### travel_coast

1. The coast deserves a moment of attention. From secure footing, preferably.

#### travel_port

1. I ask where passengers belong before becoming an obstruction.

#### travel_mountain

1. I intend to maintain a reasonable pace, with allowances for breathing.

#### travel_maw

1. I try to observe a district's customs before inconveniencing its residents.

#### travel_antler

1. I should like to finish this walk with my belongings still reasonably presentable.

#### travel_academy

1. I shall take care where I step. Age does not make masonry obliging.

#### travel_bell

1. I try to observe a district's customs before inconveniencing its residents.

#### travel_green

1. I intend to maintain a reasonable pace, with allowances for breathing.

#### travel_tally

1. I ask where passengers belong before becoming an obstruction.

#### travel_navy

1. I ask where passengers belong before becoming an obstruction.

#### travel_ossuary

1. I shall take care where I step. Age does not make masonry obliging.

#### travel_salt_court

1. I ask where passengers belong before becoming an obstruction.

#### travel_green_altar

1. I should like to finish this walk with my belongings still reasonably presentable.

#### travel_birthing_house

1. I shall take care where I step. Age does not make masonry obliging.

#### travel_low_tide

1. The coast deserves a moment of attention. From secure footing, preferably.

#### travel_pyre

1. I should like to finish this walk with my belongings still reasonably presentable.

#### travel_maw_boss

1. I try to observe a district's customs before inconveniencing its residents.

#### travel_green_boss

1. I intend to maintain a reasonable pace, with allowances for breathing.

#### travel_law

1. I prefer our obligations stated clearly before they are put into practice.

#### travel_criminal

1. I prefer our obligations stated clearly before they are put into practice.

#### travel_neutral

1. I prefer our obligations stated clearly before they are put into practice.

#### travel_return_win

1. I shall appreciate a moment to restore some order to myself upon our return.

#### travel_return_loss

1. I shall appreciate a moment to restore some order to myself upon our return.

#### travel_midleg

1. I prefer our obligations stated clearly before they are put into practice.

#### travel_response

1. Please finish your account. I am attending to it.
2. I would rather hear you fully than offer a premature opinion.

#### travel_hatred

1. [annoyed] I will not disguise my wish for you to take your bullshit elsewhere.

#### travel_romantic

1. [softly] I like that we can put the formalities down when we are together.

### F26 — Brazen

Voice ID: `ZKzVk98AXguhTaJuCEF3`

#### general

1. [calm] Hello! I like company with a bit of life in it.
2. [calm] I can be loud. Tell me if you need quiet.
3. [calm] A laugh is better when everyone gets to enjoy it.
4. [calm] I'm happy to speak plainly. It's less work.
5. [calm] I like a conversation with a bit of fucking life in it.
6. [calm] A little honesty is more entertaining than perfect manners.

#### friendly

1. [warmly] There you are! Come improve my company.
2. [warmly] I like having you around, even when we're doing nothing.
3. [warmly] We should find some time to enjoy ourselves.
4. [warmly] A friend is a fine excuse to stop working a moment.
5. [calm] Your company is the sort of trouble I make time for.

#### hatred

1. [flatly] Oh, fuck off. You're spoiling perfectly good air.
2. [flatly] Take your bullshit to someone who hasn't heard enough.
3. [flatly] I'm not being friendly. I'm being very fucking clear.
4. [flatly] Find another table and annoy that one.
5. [annoyed] You are a miserable fucking use of perfectly good air.

#### romantic

1. [softly] Come here. I'm happy you're with me.
2. [softly] I like us when there's nobody to impress.
3. [softly] An ordinary night together sounds lovely.
4. [softly] I'm glad we have time just for each other.
5. [softly] I like how close I can get to you without needing an excuse.

#### general_response

1. [calm] Hello! You've got my ear.
2. [calm] Absolutely. I could use a sit and some company.
3. [calm] Let's check the bags. Better than swearing halfway there.
4. [calm] Glad I could lend more than my fucking opinions.
5. [calm] Hello! My attention is up for grabs briefly.
6. [calm] Go on. I can listen as well as mouth off.
7. [calm] I hear you. No need for the fucking drumroll.
8. [calm] A little talk sounds like harmless fun.
9. [calm] Check the gear. Surprises are better when they do not hurt.
10. [calm] A breather sounds fucking splendid.
11. [calm] Glad I could do something besides run my mouth.
12. [calm] You are welcome. No need to get shy about it.

#### friendly_response

1. [warmly] Good! A friendly interruption.
2. [warmly] I'd like that. We can be gloriously idle.
3. [warmly] I'll check with you. I'll even be sensible.
4. [warmly] You're welcome. Good to see you still standing.
5. [calm] Good! Someone I actually want near me.
6. [calm] I like hearing your voice in the room.
7. [calm] Your company makes the day less tedious.
8. [calm] I am glad we can talk without dressing it up.
9. [calm] Check the gear. Surprises are better when they do not hurt.
10. [calm] A breather sounds fucking splendid.
11. [calm] Glad I could do something besides run my mouth.
12. [calm] You are welcome. No need to get shy about it.

#### hatred_response

1. [flatly] Oh, fuck off. You're spoiling perfectly good air.
2. [flatly] Take your bullshit to someone who hasn't heard enough.
3. [flatly] Ask someone else to check it.
4. [flatly] I heard you. I still want distance.
5. [annoyed] Oh, fuck right off with that.
6. [annoyed] I have heard your bullshit. It has not improved.

#### romantic_response

1. [softly] Hello, trouble. Yes, you have all my attention.
2. [softly] I'd enjoy a little time close.
3. [softly] Let's check, then leave the work alone.
4. [softly] Glad I could do something for you, love. Not just talk a big game.
5. [softly] You make behaving myself a very uninteresting option.
6. [softly] I like being your favourite interruption.
7. [calm] Check the gear. Surprises are better when they do not hurt.
8. [calm] A breather sounds fucking splendid.
9. [calm] Glad I could do something besides run my mouth.
10. [calm] You are welcome. No need to get shy about it.

#### departure

1. [calm] Checking my gear. I enjoy bad decisions, but not shitty buckles.

#### return

1. [calm] Back! Somebody point me at a seat before I claim the ground.

#### revived

1. [quietly] You brought me back for another round of being a fucking delight. I owe you for that.

#### theft

1. [angry] You've got my things, you cheeky shit. Hand them over.

#### funeral_general

1. [quietly] I wish I'd had a chance to hear you laugh once more.

#### funeral_friendly

1. [sad] You made me laugh. Now every funny thing catches in my throat.

#### funeral_hatred

1. [flatly] We couldn't bear one another. Death doesn't put a fucking ribbon on that.

#### funeral_romantic

1. [sad] I could be a fucking mess with you and still feel wanted. I want you here for this mess.

#### dismissal_response

1. [flatly] I'll go be a fucking delight somewhere else.
2. [calm] Fine. Enjoy the riveting pleasure of yourself.
3. [calm] All right. I can take my noise elsewhere.

#### inquiry_response

1. [calm] I will be quick. Try to contain your fucking excitement.
2. [calm] A quick word. You will survive the excitement.
3. [calm] I will get to the fucking point, then.

#### combat_hatred

1. [tense] Come on, you bitch. Try someone who bites back.

#### travel_road

1. I like a woodland ramble. The scratches are usually worth the story.

#### travel_forest

1. I like a woodland ramble. The scratches are usually worth the story.

#### travel_marsh

1. I like a woodland ramble. The scratches are usually worth the story.

#### travel_ruins

1. I'm going to look brave until I have a good reason to look elsewhere.

#### travel_crypt

1. I'm going to look brave until I have a good reason to look elsewhere.

#### travel_city

1. A city gives me plenty of chances to be somebody's bad influence.

#### travel_alley

1. A city gives me plenty of chances to be somebody's bad influence.

#### travel_prison

1. A city gives me plenty of chances to be somebody's bad influence.

#### travel_tavern

1. A city gives me plenty of chances to be somebody's bad influence.

#### travel_coast

1. This wind makes me want to shout. I rarely need the encouragement.

#### travel_port

1. Harbors make reckless ideas sound as if they have schedules.

#### travel_mountain

1. I can handle the climb. Let me bitch about it while I do.

#### travel_maw

1. A city gives me plenty of chances to be somebody's bad influence.

#### travel_antler

1. I like a woodland ramble. The scratches are usually worth the story.

#### travel_academy

1. I'm going to look brave until I have a good reason to look elsewhere.

#### travel_bell

1. A city gives me plenty of chances to be somebody's bad influence.

#### travel_green

1. I can handle the climb. Let me bitch about it while I do.

#### travel_tally

1. Harbors make reckless ideas sound as if they have schedules.

#### travel_navy

1. Harbors make reckless ideas sound as if they have schedules.

#### travel_ossuary

1. I'm going to look brave until I have a good reason to look elsewhere.

#### travel_salt_court

1. Harbors make reckless ideas sound as if they have schedules.

#### travel_green_altar

1. I like a woodland ramble. The scratches are usually worth the story.

#### travel_birthing_house

1. I'm going to look brave until I have a good reason to look elsewhere.

#### travel_low_tide

1. This wind makes me want to shout. I rarely need the encouragement.

#### travel_pyre

1. I like a woodland ramble. The scratches are usually worth the story.

#### travel_maw_boss

1. A city gives me plenty of chances to be somebody's bad influence.

#### travel_green_boss

1. I can handle the climb. Let me bitch about it while I do.

#### travel_law

1. I've read the terms. Reckless doesn't have to mean fucking uninformed.

#### travel_criminal

1. I've read the terms. Reckless doesn't have to mean fucking uninformed.

#### travel_neutral

1. I've read the terms. Reckless doesn't have to mean fucking uninformed.

#### travel_return_win

1. I'm ready to stop pretending this pack and I enjoy each other's company.

#### travel_return_loss

1. I'm ready to stop pretending this pack and I enjoy each other's company.

#### travel_midleg

1. I've read the terms. Reckless doesn't have to mean fucking uninformed.

#### travel_response

1. You've got my ear. Try not to look so fucking astonished.
2. Go on. I'll give somebody else a turn at being interesting.

#### travel_hatred

1. [annoyed] You are a miserable fucking use of perfectly good air.

#### travel_romantic

1. [softly] I like how close I can get to you without needing an excuse.

### F27 — Elegant

Voice ID: `Kexq2CdSapm18RMWwloT`

#### general

1. [calm] Hello. A little conversation would be pleasant.
2. [calm] I appreciate a clear meaning beneath good manners.
3. [calm] There's no need to make an introduction complicated.
4. [calm] I enjoy people who can be at ease.
5. [calm] I appreciate a conversation that knows how to be at ease.
6. [calm] A little grace should leave people more comfortable, not less.

#### friendly

1. [warmly] There you are. A genuinely welcome visitor.
2. [warmly] It is a pleasure to be comfortable without having to impress anyone.
3. [warmly] We ought to find time without an obligation attached.
4. [warmly] Your friendship is a pleasant part of my day.
5. [calm] Your company lets me stop considering how everything appears.

#### hatred

1. [flatly] I would be delighted if you took your bullshit elsewhere.
2. [flatly] Fuck off. I trust the plain version will suffice.
3. [flatly] Your absence would be the gracious contribution.
4. [flatly] I have no appetite for another minute of this.
5. [annoyed] I have no appetite for another helping of your fucking company.

#### romantic

1. [softly] Come sit beside me. I'm pleased you're here.
2. [softly] These easy moments with you are the ones I look forward to.
3. [softly] You needn't be charming every minute.
4. [softly] I'm happy to spend an ordinary evening with you.
5. [softly] I like that I can be comfortable with you without being composed.

#### general_response

1. [calm] Hello. I am quite content to listen for a while.
2. [calm] A little company would make the pause more agreeable.
3. [calm] Let's check carefully. It spares so much fuss.
4. [calm] You're welcome. I am pleased the effort served its purpose.
5. [calm] Hello. A little attention is yours.
6. [calm] I hear you. Please continue at your ease.
7. [calm] A brief exchange would be agreeable.
8. [calm] You have a moment of my interest now.
9. [calm] An inspection would spare a less graceful surprise later.
10. [calm] A little rest sounds perfectly agreeable.
11. [calm] I am pleased the help was well received.
12. [calm] You are welcome. No elaborate thanks are necessary.

#### friendly_response

1. [warmly] A welcome voice. Tell me.
2. [warmly] I'd enjoy sitting together without having to make an occasion of it.
3. [warmly] I'll check with you. We can make it less tedious.
4. [warmly] You're welcome. No formal thanks required.
5. [calm] I am delighted to have your company a while.
6. [calm] Your voice is a welcome change in the day.
7. [calm] I like how comfortably we can talk.
8. [calm] It is a pleasure to make time for you.
9. [calm] An inspection would spare a less graceful surprise later.
10. [calm] A little rest sounds perfectly agreeable.
11. [calm] I am pleased the help was well received.
12. [calm] You are welcome. No elaborate thanks are necessary.

#### hatred_response

1. [flatly] I would be delighted if you took your bullshit elsewhere.
2. [flatly] Fuck off. I trust the plain version will suffice.
3. [flatly] Please find someone else to assist.
4. [flatly] Your thanks are noted. We can finish there.
5. [annoyed] I would be grateful for considerably less of your presence.
6. [annoyed] Take the bullshit somewhere my manners need not endure it.

#### romantic_response

1. [softly] Darling, you have made it very easy to set everything else aside.
2. [softly] A quiet moment with you sounds like something to savor.
3. [softly] Let's give our preparations a little care before turning to each other.
4. [softly] I was glad to offer you something more useful than sympathy, love.
5. [softly] You make being unguarded feel very natural.
6. [softly] I like how little else matters when you are close.
7. [calm] An inspection would spare a less graceful surprise later.
8. [calm] A little rest sounds perfectly agreeable.
9. [calm] I am pleased the help was well received.
10. [calm] You are welcome. No elaborate thanks are necessary.

#### departure

1. [calm] Let me see to my pack. Preparation deserves a little attention.

#### return

1. [calm] Back at last. I intend to sit down with considerably less grace than usual.

#### revived

1. [quietly] I wanted a quiet moment to thank you for bringing me back. There is no graceful way to make that seem small.

#### theft

1. [angry] Please return what you took. Courtesy doesn't obscure what happened.

#### funeral_general

1. [quietly] I hope you were seen with affection in moments strangers never witnessed.

#### funeral_friendly

1. [sad] I thought I could carry this with dignity. I would rather have you.

#### funeral_hatred

1. [flatly] I will step aside.

#### funeral_romantic

1. [sad] I keep seeing something beautiful and turning to share it. I haven't learned the shape of your absence.

#### dismissal_response

1. [flatly] I'll leave you to enjoy the quiet you've requested.
2. [calm] As you wish. I shall give you room.
3. [calm] Understood. I have no desire to impose.

#### inquiry_response

1. [calm] Only a little of your time. I appreciate it.
2. [calm] A few words, without unnecessary ornament.
3. [calm] I will keep the exchange pleasantly brief.

#### combat_hatred

1. [tense] What an ugly fucking way to spend an afternoon.

#### travel_road

1. I enjoy the green light under trees. I make allowances for what it does to hems.

#### travel_forest

1. I enjoy the green light under trees. I make allowances for what it does to hems.

#### travel_marsh

1. I enjoy the green light under trees. I make allowances for what it does to hems.

#### travel_ruins

1. I can appreciate old stone without touching everything that has survived this long.

#### travel_crypt

1. I can appreciate old stone without touching everything that has survived this long.

#### travel_city

1. A city reveals itself in its small details. I prefer walking slowly enough to see them.

#### travel_alley

1. A city reveals itself in its small details. I prefer walking slowly enough to see them.

#### travel_prison

1. A city reveals itself in its small details. I prefer walking slowly enough to see them.

#### travel_tavern

1. A city reveals itself in its small details. I prefer walking slowly enough to see them.

#### travel_coast

1. I love the changing color of the water. Rather less its effect on leather.

#### travel_port

1. A working harbor has a grace of its own, best admired from outside the work.

#### travel_mountain

1. I reserve my admiration for the view until I have breath to do it justice.

#### travel_maw

1. A city reveals itself in its small details. I prefer walking slowly enough to see them.

#### travel_antler

1. I enjoy the green light under trees. I make allowances for what it does to hems.

#### travel_academy

1. I can appreciate old stone without touching everything that has survived this long.

#### travel_bell

1. A city reveals itself in its small details. I prefer walking slowly enough to see them.

#### travel_green

1. I reserve my admiration for the view until I have breath to do it justice.

#### travel_tally

1. A working harbor has a grace of its own, best admired from outside the work.

#### travel_navy

1. A working harbor has a grace of its own, best admired from outside the work.

#### travel_ossuary

1. I can appreciate old stone without touching everything that has survived this long.

#### travel_salt_court

1. A working harbor has a grace of its own, best admired from outside the work.

#### travel_green_altar

1. I enjoy the green light under trees. I make allowances for what it does to hems.

#### travel_birthing_house

1. I can appreciate old stone without touching everything that has survived this long.

#### travel_low_tide

1. I love the changing color of the water. Rather less its effect on leather.

#### travel_pyre

1. I enjoy the green light under trees. I make allowances for what it does to hems.

#### travel_maw_boss

1. A city reveals itself in its small details. I prefer walking slowly enough to see them.

#### travel_green_boss

1. I reserve my admiration for the view until I have breath to do it justice.

#### travel_law

1. I like to understand an undertaking before lending it my enthusiasm.

#### travel_criminal

1. I like to understand an undertaking before lending it my enthusiasm.

#### travel_neutral

1. I like to understand an undertaking before lending it my enthusiasm.

#### travel_return_win

1. I am increasingly taken with the beauty of comfortable furniture.

#### travel_return_loss

1. I am increasingly taken with the beauty of comfortable furniture.

#### travel_midleg

1. I like to understand an undertaking before lending it my enthusiasm.

#### travel_response

1. Do continue. I am content to leave the conversation in your hands.
2. I'm considering your words. They deserve more than a reflex.

#### travel_hatred

1. [annoyed] I have no appetite for another helping of your fucking company.

#### travel_romantic

1. [softly] I like that I can be comfortable with you without being composed.

### F28 — Dutiful

Voice ID: `RewGaHimUnPqdkKgE5mb`

#### general

1. [calm] Hello. I like knowing what needs doing.
2. [calm] A clear arrangement helps people keep their word.
3. [calm] The small tasks deserve care too.
4. [calm] I'm happy to say when I need help.
5. [calm] I like a conversation that leaves people clearer than it found them.
6. [calm] Not every moment needs to be used for something practical.

#### friendly

1. [warmly] Good to see you. Work can wait a moment.
2. [warmly] I enjoy being with a friend without a list to finish.
3. [warmly] Your company is welcome in my day.
4. [warmly] We should have time to simply sit together.
5. [calm] Your company reminds me that time can be worthwhile without a task.

#### hatred

1. [flatly] I have other things to do than put up with your shit.
2. [flatly] Please keep your damned distance.
3. [flatly] Being civil to you is enough work already.
4. [flatly] I don't want your company, and I mean that.
5. [annoyed] I have no duty to endure your fucking company.

#### romantic

1. [warmly] I'm ready. Just wanted a moment with you before the day gets busy.
2. [softly] The day can ask plenty of me. I still want some of it for us.
3. [softly] You're someone I want beside me.
4. [softly] I'm happy we have a moment that's ours.
5. [softly] I like making time for us before the day asks for everything else.

#### general_response

1. [calm] Hello. What would you like to say?
2. [calm] I'd appreciate some company.
3. [calm] Let's go through the list together.
4. [calm] I'm glad I could do my part.
5. [calm] Hello. I can put aside a moment.
6. [calm] I hear you. Let us keep this clear.
7. [calm] I'm listening to this before attending to the next thing.
8. [calm] A short conversation will fit into the day.
9. [calm] Check the supplies. It is worth doing before we rely on them.
10. [calm] A rest sounds like something we should allow ourselves.
11. [calm] I am glad the effort helped you.
12. [calm] You are welcome. I did not do it to create a debt.

#### friendly_response

1. [warmly] I'm glad you spoke. I want to make time for a friend.
2. [warmly] I'd enjoy a little time together.
3. [warmly] I'll check with you. Easier to be certain.
4. [warmly] You're welcome. I'm glad it helped you.
5. [calm] It's good to stop and speak with someone I care about.
6. [calm] Your company is worth making time for.
7. [calm] It is good to speak without a task between us.
8. [calm] I like these pauses we get together.
9. [calm] Check the supplies. It is worth doing before we rely on them.
10. [calm] A rest sounds like something we should allow ourselves.
11. [calm] I am glad the effort helped you.
12. [calm] You are welcome. I did not do it to create a debt.

#### hatred_response

1. [flatly] I have other things to do than put up with your shit.
2. [flatly] Please keep your damned distance.
3. [flatly] Your preparations will need someone else's help.
4. [flatly] I hear your thanks. I still need distance.
5. [annoyed] I have work enough without your damned interruptions.
6. [annoyed] I heard you. I have no wish to hear more.

#### romantic_response

1. [softly] Love, I'm here. The things that need doing can wait a moment.
2. [softly] Yes, let's sit close and leave the unfinished things alone a while.
3. [softly] Let's check what we both need before I take on another task.
4. [softly] I wanted to help you. I'm glad I could finish something that mattered.
5. [softly] You are someone I want time for, not another obligation.
6. [softly] I like the part of the day that belongs to us.
7. [calm] Check the supplies. It is worth doing before we rely on them.
8. [calm] A rest sounds like something we should allow ourselves.
9. [calm] I am glad the effort helped you.
10. [calm] You are welcome. I did not do it to create a debt.

#### departure

1. [calm] Checking my supplies before we go. I do not like leaving work unfinished.

#### return

1. [calm] Back. I need to set the pack down before I take on anything else.

#### revived

1. [quietly] You took care of bringing me back. I wanted to recognize what you did before another task distracted me.

#### theft

1. [angry] Return it. Someone else's belongings aren't there to fill a gap in yours.

#### funeral_general

1. [quietly] I hope someone cared for you as a person, beyond what needed doing.

#### funeral_friendly

1. [sad] I kept thinking about what needed doing. I wish I had stayed and talked more.

#### funeral_hatred

1. [flatly] I will see that the practical things are done.

#### funeral_romantic

1. [sad] I thought there would be time after everything was done. I wish I'd left more things undone for you.

#### dismissal_response

1. [flatly] I won't add another obligation to your time.
2. [calm] Understood. I will leave you to your day.
3. [calm] All right. I can attend to something else.

#### inquiry_response

1. [calm] I will be brief. There are other things to see to.
2. [calm] A brief word, and then I will let you continue.
3. [calm] I will keep to what needs saying.

#### combat_hatred

1. [tense] I am staying on my feet. You will have to work for this, damn it.

#### travel_road

1. I check behind us from time to time. Nobody should have to ask us to notice.

#### travel_forest

1. I check behind us from time to time. Nobody should have to ask us to notice.

#### travel_marsh

1. I check behind us from time to time. Nobody should have to ask us to notice.

#### travel_ruins

1. I'll watch the way back while we find the way forward.

#### travel_crypt

1. I'll watch the way back while we find the way forward.

#### travel_city

1. I make room for people carrying more than I am.

#### travel_alley

1. I make room for people carrying more than I am.

#### travel_prison

1. I make room for people carrying more than I am.

#### travel_tavern

1. I make room for people carrying more than I am.

#### travel_coast

1. I'll enjoy the shoreline once I'm certain nobody needs a hand.

#### travel_port

1. I wait for instructions on a dock. Helping badly creates more work.

#### travel_mountain

1. I try to keep enough breath to answer if someone calls.

#### travel_maw

1. I make room for people carrying more than I am.

#### travel_antler

1. I check behind us from time to time. Nobody should have to ask us to notice.

#### travel_academy

1. I'll watch the way back while we find the way forward.

#### travel_bell

1. I make room for people carrying more than I am.

#### travel_green

1. I try to keep enough breath to answer if someone calls.

#### travel_tally

1. I wait for instructions on a dock. Helping badly creates more work.

#### travel_navy

1. I wait for instructions on a dock. Helping badly creates more work.

#### travel_ossuary

1. I'll watch the way back while we find the way forward.

#### travel_salt_court

1. I wait for instructions on a dock. Helping badly creates more work.

#### travel_green_altar

1. I check behind us from time to time. Nobody should have to ask us to notice.

#### travel_birthing_house

1. I'll watch the way back while we find the way forward.

#### travel_low_tide

1. I'll enjoy the shoreline once I'm certain nobody needs a hand.

#### travel_pyre

1. I check behind us from time to time. Nobody should have to ask us to notice.

#### travel_maw_boss

1. I make room for people carrying more than I am.

#### travel_green_boss

1. I try to keep enough breath to answer if someone calls.

#### travel_law

1. I want to finish what I agreed to without quietly leaving my part to someone else.

#### travel_criminal

1. I want to finish what I agreed to without quietly leaving my part to someone else.

#### travel_neutral

1. I want to finish what I agreed to without quietly leaving my part to someone else.

#### travel_return_win

1. I'll make time to rest when we're back. That needs doing too.

#### travel_return_loss

1. I'll make time to rest when we're back. That needs doing too.

#### travel_midleg

1. I want to finish what I agreed to without quietly leaving my part to someone else.

#### travel_response

1. I'm listening properly. The other things can wait a moment.
2. Please finish. I don't want to miss something you meant to say.

#### travel_hatred

1. [annoyed] I have no duty to endure your fucking company.

#### travel_romantic

1. [softly] I like making time for us before the day asks for everything else.

### F29 — Exacting

Voice ID: `fazkFGFrALkyPulDqqzW`

#### general

1. [calm] Hello. I like to understand the details.
2. [calm] A precise question makes an answer easier.
3. [calm] I'd rather check a fact than guess confidently.
4. [calm] There is usually time to be careful.
5. [calm] I prefer a clear meaning to an impressive choice of words.
6. [calm] A useful conversation makes room for uncertainty.

#### friendly

1. [warmly] I'm pleased to see you. I enjoy our conversations.
2. [warmly] It's nice to speak with a friend without checking every word.
3. [warmly] We can put the practical matters aside awhile.
4. [warmly] I want to make room for your company, without treating it as another appointment.
5. [calm] Your company lets me stop examining every small detail.

#### hatred

1. [flatly] To be precise: fuck off.
2. [flatly] I do not need another example of your bullshit.
3. [flatly] My meaning was clear. I want some distance.
4. [flatly] Keep this necessary. The rest is a waste of time.
5. [annoyed] I have measured my patience, and your bullshit exceeds it.

#### romantic

1. [softly] Come sit beside me. I'm glad we have time.
2. [softly] I like the quiet particulars of our life together.
3. [softly] You don't have to get every word right with me.
4. [softly] I'm happy you're here. Precisely that.
5. [softly] I like how little correction a moment with you requires.

#### general_response

1. [calm] Hello. Please explain.
2. [calm] A short break would be welcome.
3. [calm] Let's check the contents against the list.
4. [calm] You're welcome. I'm pleased it answered the actual need.
5. [calm] I hear you. I am attending to the point.
6. [calm] Hello. A brief word is possible.
7. [calm] Go on. I would like the meaning clear.
8. [calm] You have a moment of focused attention.
9. [calm] Count and check. An assumption is not a spare supply.
10. [calm] A pause would give us time to settle our thoughts.
11. [calm] I am glad the help did what was needed.
12. [calm] Your thanks are understood. No further accounting is necessary.

#### friendly_response

1. [warmly] It's good to hear from you without having to read between every word.
2. [warmly] I would enjoy sitting down together with nothing to resolve.
3. [warmly] Let's compare what we have against what we need.
4. [warmly] You're welcome. I'm glad you're well.
5. [calm] I am glad we can speak so easily.
6. [calm] Your company is worth the time exactly as it is.
7. [calm] It is good to hear a voice I trust.
8. [calm] I like not having to untangle our conversations.
9. [calm] Count and check. An assumption is not a spare supply.
10. [calm] A pause would give us time to settle our thoughts.
11. [calm] I am glad the help did what was needed.
12. [calm] Your thanks are understood. No further accounting is necessary.

#### hatred_response

1. [flatly] To be precise: fuck off.
2. [flatly] I do not need another example of your bullshit.
3. [flatly] I am not available to verify your supplies.
4. [flatly] Acknowledged. We needn't add anything.
5. [annoyed] I understood you precisely. I still want you gone.
6. [annoyed] I do not require another fucking example.

#### romantic_response

1. [softly] There you are. You have my attention, without qualification.
2. [softly] I'd like a moment close.
3. [softly] Let's make certain we're both prepared.
4. [softly] I am glad the help I gave was what you needed, love.
5. [softly] You are the detail my attention returns to.
6. [softly] I like how comfortably we fit into a quiet moment.
7. [calm] Count and check. An assumption is not a spare supply.
8. [calm] A pause would give us time to settle our thoughts.
9. [calm] I am glad the help did what was needed.
10. [calm] Your thanks are understood. No further accounting is necessary.

#### departure

1. [calm] I am counting my supplies. An estimate is not the same as having them.

#### return

1. [calm] Back. I need a moment to check what is still in the pack.

#### revived

1. [quietly] I want to be precise about my gratitude: you made my return possible. I have not overlooked that.

#### theft

1. [angry] I know what is missing. Return it, and we can stop discussing whether it was taken.

#### funeral_general

1. [quietly] I will remember what I actually knew of you. It matters to get that right.

#### funeral_friendly

1. [sad] I remember such small things about you. I am afraid of getting any of them wrong.

#### funeral_hatred

1. [flatly] Our dealings were unpleasant. I cannot honestly call them anything else.

#### funeral_romantic

1. [sad] I keep trying to remember the last ordinary thing you said. I want all the small details back.

#### dismissal_response

1. [flatly] I understand your request. I'll act on it now.
2. [calm] Understood. I will give the requested distance.
3. [calm] All right. Your meaning was clear enough.

#### inquiry_response

1. [calm] The short version. I will be precise.
2. [calm] A short and specific word, then.
3. [calm] I will state exactly what I mean.

#### combat_hatred

1. [tense] I am watching for the opening. Keep that in mind. What the hell.

#### travel_road

1. I like to know whether a bend in the path matches the route we were given.

#### travel_forest

1. I like to know whether a bend in the path matches the route we were given.

#### travel_marsh

1. I like to know whether a bend in the path matches the route we were given.

#### travel_ruins

1. I count the turns. Similar-looking passages are no reason to guess.

#### travel_crypt

1. I count the turns. Similar-looking passages are no reason to guess.

#### travel_city

1. I check a street name before assuming the directions were accurate.

#### travel_alley

1. I check a street name before assuming the directions were accurate.

#### travel_prison

1. I check a street name before assuming the directions were accurate.

#### travel_tavern

1. I check a street name before assuming the directions were accurate.

#### travel_coast

1. I want to know where the water reaches, not merely where it is now.

#### travel_port

1. I ask exactly what passage includes. Approximately is an expensive word.

#### travel_mountain

1. I prefer a measured pace to repeatedly discovering I went too fast.

#### travel_maw

1. I check a street name before assuming the directions were accurate.

#### travel_antler

1. I like to know whether a bend in the path matches the route we were given.

#### travel_academy

1. I count the turns. Similar-looking passages are no reason to guess.

#### travel_bell

1. I check a street name before assuming the directions were accurate.

#### travel_green

1. I prefer a measured pace to repeatedly discovering I went too fast.

#### travel_tally

1. I ask exactly what passage includes. Approximately is an expensive word.

#### travel_navy

1. I ask exactly what passage includes. Approximately is an expensive word.

#### travel_ossuary

1. I count the turns. Similar-looking passages are no reason to guess.

#### travel_salt_court

1. I ask exactly what passage includes. Approximately is an expensive word.

#### travel_green_altar

1. I like to know whether a bend in the path matches the route we were given.

#### travel_birthing_house

1. I count the turns. Similar-looking passages are no reason to guess.

#### travel_low_tide

1. I want to know where the water reaches, not merely where it is now.

#### travel_pyre

1. I like to know whether a bend in the path matches the route we were given.

#### travel_maw_boss

1. I check a street name before assuming the directions were accurate.

#### travel_green_boss

1. I prefer a measured pace to repeatedly discovering I went too fast.

#### travel_law

1. I distinguish what was promised from what I merely assumed.

#### travel_criminal

1. I distinguish what was promised from what I merely assumed.

#### travel_neutral

1. I distinguish what was promised from what I merely assumed.

#### travel_return_win

1. I will take stock once we're back and I can do it without walking.

#### travel_return_loss

1. I will take stock once we're back and I can do it without walking.

#### travel_midleg

1. I distinguish what was promised from what I merely assumed.

#### travel_response

1. I'll hear the complete account before drawing a conclusion.
2. I'm listening for what you mean, not just the phrasing.

#### travel_hatred

1. [annoyed] I have measured my patience, and your bullshit exceeds it.

#### travel_romantic

1. [softly] I like how little correction a moment with you requires.

### F30 — Bereaved

Voice ID: `VIPtPJaY9dPaNIMgAKpr`

#### general

1. [calm] Hello. I prefer a little time to settle.
2. [calm] Some days an ordinary conversation is welcome.
3. [calm] I'm listening. I might not have a quick answer.
4. [calm] I like small comforts that don't ask much of anyone.
5. [calm] I like the small exchanges that make a place feel inhabited.
6. [calm] An ordinary voice can keep a day from slipping too far away.

#### friendly

1. [warmly] It's good to see a friend.
2. [warmly] I enjoy your company without needing to explain my mood.
3. [warmly] We can be quiet together.
4. [warmly] I'm glad there's time for us to sit awhile.
5. [calm] Your company makes the quiet a little less empty.

#### hatred

1. [flatly] I've no room for your shit.
2. [flatly] Please leave me alone with my own thoughts.
3. [flatly] Damn it, I asked to be left alone. Please listen.
4. [flatly] Give me the distance I'm asking for.
5. [annoyed] I have no space left for your fucking unpleasantness.

#### romantic

1. [softly] Sit with me a little. I am glad of the warmth.
2. [softly] I like the ordinary moments we have together.
3. [softly] You don't have to mend every difficult feeling.
4. [softly] I'm happy to share this part of the day with you.
5. [softly] I like knowing I can be near you in this particular moment.

#### general_response

1. [calm] Hello. I'm here, listening.
2. [calm] A quiet moment together might be nice.
3. [calm] We can check slowly. No need to hurry.
4. [calm] I'm glad I could make a small difference where one was needed.
5. [calm] Hello. I hear you here with me.
6. [calm] Go on. A little conversation is all right.
7. [calm] I can give you a moment's attention.
8. [calm] Your words have reached me. I am listening.
9. [calm] A careful check gives us one less thing to worry about.
10. [calm] A quiet rest would be welcome now.
11. [calm] I am glad I could make something easier for you.
12. [calm] You are welcome. Let that kindness stand on its own.

#### friendly_response

1. [warmly] It's good to have your voice here in the day.
2. [warmly] I would like some company that doesn't require me to explain the quiet.
3. [warmly] I'll go through things with you.
4. [warmly] You're welcome. I'm glad you're still with us.
5. [calm] I am glad to have a familiar voice close by.
6. [calm] Your company helps me feel part of the day.
7. [calm] It is good to share a little time with you.
8. [calm] I like being able to pause beside a friend.
9. [calm] A careful check gives us one less thing to worry about.
10. [calm] A quiet rest would be welcome now.
11. [calm] I am glad I could make something easier for you.
12. [calm] You are welcome. Let that kindness stand on its own.

#### hatred_response

1. [flatly] I've no room for your shit.
2. [flatly] Please leave me alone with my own thoughts.
3. [flatly] I haven't the heart to help with your preparations. Ask someone else.
4. [flatly] I hear you. I need room now.
5. [annoyed] Please do not make the quiet worse by staying.
6. [annoyed] I have no room for another damned word from you.

#### romantic_response

1. [softly] There you are, love. I'm glad we have this moment while it's here.
2. [softly] I'd like to be close a while.
3. [softly] Let's check things together. It gives us a little care to share.
4. [softly] I'm grateful I could help you, and that you're here to tell me.
5. [softly] I like having this moment with you while it is here.
6. [softly] You make the ordinary hours feel precious.
7. [calm] A careful check gives us one less thing to worry about.
8. [calm] A quiet rest would be welcome now.
9. [calm] I am glad I could make something easier for you.
10. [calm] You are welcome. Let that kindness stand on its own.

#### departure

1. [calm] Let me check the pack once more. It settles me a little.

#### return

1. [calm] Back again. I would like a quiet place to sit.

#### revived

1. [quietly] You brought me back when I might have become another absence. I am grateful, even when it is difficult to say.

#### theft

1. [angry] Please return it. I can't bear people deciding what I should lose.

#### funeral_general

1. [quietly] I know a little of the space you will leave. I'm sorry for those who know it well.

#### funeral_friendly

1. [sad] I know what missing someone is. Knowing has not made this easier.

#### funeral_hatred

1. [flatly] We had no comfort to give each other.

#### funeral_romantic

1. [sad] I knew love could end in this. I would still choose our time together. I just wanted more.

#### dismissal_response

1. [flatly] I'll leave you alone. I know what it is to need that.
2. [calm] All right. I will leave you alone with your thoughts.
3. [calm] I understand. I can take my company elsewhere.

#### inquiry_response

1. [calm] Only a moment. Thank you for hearing me.
2. [calm] Only a little of your time, briefly.
3. [calm] I will try to keep the words simple.

#### combat_hatred

1. [tense] I have seen enough graves. I do not want yours or mine. Shit.

#### travel_road

1. I like the way a path can occupy my feet while my thoughts go elsewhere.

#### travel_forest

1. I like the way a path can occupy my feet while my thoughts go elsewhere.

#### travel_marsh

1. I like the way a path can occupy my feet while my thoughts go elsewhere.

#### travel_ruins

1. I don't need the dark to remind me what absence feels like.

#### travel_crypt

1. I don't need the dark to remind me what absence feels like.

#### travel_city

1. Sometimes an ordinary street reminds me of someone. I never know which one will.

#### travel_alley

1. Sometimes an ordinary street reminds me of someone. I never know which one will.

#### travel_prison

1. Sometimes an ordinary street reminds me of someone. I never know which one will.

#### travel_tavern

1. Sometimes an ordinary street reminds me of someone. I never know which one will.

#### travel_coast

1. I watch the water come back and try not to ask that of other things.

#### travel_port

1. I find departures difficult. Watching the work gives me somewhere to put my eyes.

#### travel_mountain

1. The climb makes me attend to the next step. There is kindness in that.

#### travel_maw

1. Sometimes an ordinary street reminds me of someone. I never know which one will.

#### travel_antler

1. I like the way a path can occupy my feet while my thoughts go elsewhere.

#### travel_academy

1. I don't need the dark to remind me what absence feels like.

#### travel_bell

1. Sometimes an ordinary street reminds me of someone. I never know which one will.

#### travel_green

1. The climb makes me attend to the next step. There is kindness in that.

#### travel_tally

1. I find departures difficult. Watching the work gives me somewhere to put my eyes.

#### travel_navy

1. I find departures difficult. Watching the work gives me somewhere to put my eyes.

#### travel_ossuary

1. I don't need the dark to remind me what absence feels like.

#### travel_salt_court

1. I find departures difficult. Watching the work gives me somewhere to put my eyes.

#### travel_green_altar

1. I like the way a path can occupy my feet while my thoughts go elsewhere.

#### travel_birthing_house

1. I don't need the dark to remind me what absence feels like.

#### travel_low_tide

1. I watch the water come back and try not to ask that of other things.

#### travel_pyre

1. I like the way a path can occupy my feet while my thoughts go elsewhere.

#### travel_maw_boss

1. Sometimes an ordinary street reminds me of someone. I never know which one will.

#### travel_green_boss

1. The climb makes me attend to the next step. There is kindness in that.

#### travel_law

1. I give myself a clear task to return to when my thoughts drift.

#### travel_criminal

1. I give myself a clear task to return to when my thoughts drift.

#### travel_neutral

1. I give myself a clear task to return to when my thoughts drift.

#### travel_return_win

1. A familiar place won't settle everything. I'm still looking forward to it.

#### travel_return_loss

1. A familiar place won't settle everything. I'm still looking forward to it.

#### travel_midleg

1. I give myself a clear task to return to when my thoughts drift.

#### travel_response

1. I am listening. You don't have to ease every word for me.
2. Keep going. It's good to have someone else's thought to follow.

#### travel_hatred

1. [annoyed] I have no space left for your fucking unpleasantness.

#### travel_romantic

1. [softly] I like knowing I can be near you in this particular moment.

## Travel location captions

These are environmental captions, not personal memories assigned to every companion. Personality remarks cover the six terrain types, with separate work, return, and relationship remarks.

- **The County Road**: Milestones outlast the promises made along the county road.
- **The Deep Wood**: The old bridge is officially condemned. Its crossing toll is still collected.
- **The Reed Marsh**: Marsh guides distrust lanterns whose light never touches the reeds.
- **The Old Ruins**: Three crests occupy the same stones. None quite conceals the name beneath it.
- **The Crypt Steps**: Gravediggers advise counting the steps down, then counting them again on the way out.
- **The Watch District**: Old watch marks linger on sheltered doors. Rain has cleared the others.
- **The Back Alleys**: An address here may have two doors. Only one is mentioned when strangers ask.
- **The Lockup Quarter**: Visitors bring food to the lockup. Guards have been known to charge for returning the bowl.
- **The Tavern Quarter**: The chalkboard prices leave generous room for revision.
- **The Tidelands**: Old charts place a village beyond the present shoreline.
- **The Outer Harbor**: A passage fare does not always include everything a passenger assumes it does.
- **The High Pass**: Carriers built the shelters low enough for the worst wind to pass over them.
- **Behind the Laundry**: Behind the laundry, parcels change hands that nobody has brought to wash.
- **The Antler Toll Road**: Companies change their banners. The toll collector remains at the same gate.
- **Varenholm Approach**: At Varenholm, a delivery of ink may receive a more thorough inspection than its courier.
- **The Paper Shop Lanes**: The paper shops trade in names as readily as stationery.
- **The Green-Eyed Pass**: Recruits sweep the steps in the rain. Their teachers say the leaves are not the lesson.
- **The Red Tally Anchorage**: Tally crews defend their shares even when nobody wants what is being divided.
- **The Admiralty Docks**: The tide keeps its own timetable. Admiralty paperwork prefers another.
- **The Ossuary**: Bone carts serve the Ossuary. The drivers are reluctant to discuss their work.
- **The Salt Court**: Salt has erased the king from surviving coins of the drowned court. His crown remains.
- **The Green Altar**: A woodcutter claimed his buried axe grew leaves here. Others have come to look.
- **The Birthing House**: Roots have lifted sections of the old garden wall clear of the ground.
- **The Low Tide Coves**: The safe crossing stones change as winter tides reshape the coves.
- **The Ash Fields**: The charcoal burners left after fires began appearing where none had been set.
- **The Lamplighter Quarter**: Windows once dark after supper now keep candles burning, even in empty rooms.
- **The Widow’s Courtyard**: At practice in the courtyard, permission to speak comes after permission to lower a blade.

## Faction scripts

The existing five-contract progression, optional companion participation, Antler choice, combat systems, and rewards remain the foundation. New scene captions stage actions through the existing portrait cutscenes.

### The Gaping Maw (maw)

#### Contracts

1. **A Quiet Room** — A debtor has hired guards against a Maw contract. Wren wants the contract settled and the papers recovered; those papers may explain who has been warning the watch.
2. **The Ledger Run** — The recovered papers point to a courier carrying guild names. Recover the ledger before the watch receives another copy.
3. **The Understudy** — The ledger points to an insider called the Understudy. Find how the names are leaving the guild. Kite can accompany you.
4. **The Contract** — The next contract uses the same courier route. Follow it to the target, but expect someone to be watching for the guild.
5. **Bookkeeping** — Arden still has informants placing guild members in danger. Vane will help stop her operation. The evidence already delivered to the watch will remain a threat.

#### Rival death staging

Kite sees the crossbow in the upper window and pulls you behind the stonework. Arden has a second line of fire. Kite falls before reaching cover.

If the rival did not accompany the company, a news card replaces the witnessed scene.

#### Wren Pell — wren

Voice ID: `Uo9t2VZwwK6A713rLbZs`

**offer**

1. [quietly] Wren Pell. The laundry is real. The work behind it is less respectable.
2. [calm] You have a record of criminal contracts. That is why I'm speaking to you.
3. [quietly] The Gaping Maw pays for work people won't put on the public board. If you want in, I have a contract ready.

**tutorial**

1. [calm] Your jobs come from us now. Do not take the jobs posted in town. Come here, behind the laundry. I will have work waiting.
2. [flatly] There are five jobs. Each one is harder than the last. Do them in order.
3. [quietly] Watch our people when you fight. You will see skills you cannot buy. That is how you learn them.
4. [calm] Finish all five and we give you a full set of our gear. Everything you saw stays yours.

**decline**

1. [flatly] Fine. I am here every day if you change your mind.

**debrief1**

1. [calm] The contract is closed. These papers are the part I want to examine. Someone knew where our people would be.

**debrief2**

1. [thoughtful] The list matches our contracts. This is coming from inside the guild. I want the Understudy found before another name goes out.

**debrief3**

1. [quietly] The leak is real. The next contract follows its route. I will not call that a coincidence.

**debrief4**

1. [sad] Kite is gone. I keep looking toward the door.
2. [quietly] I used to complain about the mud on those boots. I wish there were mud on the floor now.

**why**

1. [tired] People ask how I sleep. I tell them I fold shirts and pass messages. I have never killed anyone.
2. [quietly] That is true. It is also a lie. I send people out to kill and I sleep anyway. You will learn how. You will sleep too.

#### Kite — kite

Voice ID: `BrIBIyZFGKiz0DQpMAH3`

**after1**

1. [calm] Kite. Before you ask, no, the laundry doesn't clean blood out for free.
2. [thoughtful] I check the way out before I look at the target. The fee isn't much use if you can't collect it.

**after2**

1. [calm] That ledger has people frightened. I'm one of them. Give me a moment with it before Wren files it away.
2. [quietly] If we're sent after the leak, I'd rather we both knew what we're walking into.

**join3**

1. [calm] I'll watch for whoever is watching us. You keep an eye on the job itself.

**banter**

1. [focused] Keep an eye on the approaches. I will watch the way out.
2. [focused] Stay aware of the exits. This job is no use if we cannot leave.

**after3**

1. [quietly] It's easier to think when I don't have to watch every direction alone.
2. [playfully] Don't tell Wren. He'll put partnership down as a substitute for hazard pay.

**before4**

1. [calm] Same courier route. I don't like that.
2. [quietly] We'll compare what we see before we commit to anything.

**death**

1. [alarmed] Crossbow! Get behind the stone—

**travel**

1. I learned these lanes carrying messages. A short route is no use if someone remembers your face.
2. Good. Remember the way out as well.

#### Vesna Arden — arden

Voice ID: `t9puW54s29EO0gQK6OMR`

**appear**

1. [calm] Guild marks. A contract. Witnesses. You have brought everything I needed.

**afterKill**

1. [quietly] The guild killed my mother. My father paid for it. I killed him, and the contracts kept coming.
2. [flatly] The watch has the names now. Tell Vane his secrecy is gone. That is why I am letting you leave.

**final**

1. [angry] Vane. You finally came yourself.
2. [calm] The evidence is already delivered. If you want silence, you are too late.

#### Ossian Vane — vane

Voice ID: `CMzJl3u93UrCfd1ovQ5X`

**first**

1. [calm] I'm Ossian Vane. I run the Gaping Maw. Every job, every name, every one of us.
2. [flatly] I look at new people myself. Wren already has an opinion. He is usually right. That is why I will not hear it first.
3. [calm] Go take a job. Come back after. I will tell you what I saw. That is the only test you get from me.

**hunt**

1. [quietly] Arden has been turning our contracts into traps. I should have acted when the first names disappeared.
2. [calm] We stop the killings tonight. Then we deal with the watch. Killing her will not make that ledger vanish.

**afterFall**

1. [quietly] No more contracts through that route. I will tell Wren myself.
2. [sad] Kite should have been here to tell me I was late.

**ending**

1. [calm] The watch still has our names. We move the people at risk and abandon the exposed routes.
2. [quietly] There is a place for you here. We will remember who made room for it.

**travel**

1. I have sent people through these streets for years. Today I get to see what I have been asking of them.

**fight**

1. [angry] Do not let her talk. Put that bitch down.
2. [flatly] Watch the knife. If she speaks, she is buying time.

### The Antler (antler)

#### Contracts

1. **The Toll** — A rival company is collecting an unauthorized toll. Reopen the road under the client's contract and find out who hired them.
2. **Settlement** — The client disputes payment for the reopened road. Settle the contract. The company's low costs have also attracted an auditor's attention.
3. **Two Companies** — Two companies claim the same work. Resolve the competing contract. Dain can accompany you; ask what his contract expects of the people under him.
4. **Margins** — Escort duty along the reopened road. Dain's use of Conscript has drawn a divine champion. The company cannot assume its paperwork protects him.
5. **No Paper On It** — Crane wants revenge for Dain. Hargrave acted against his use of Conscript. Choose whose cause you will support; the choice has consequences beyond this company.

#### Rival death staging

Dain puts his shield between the escort and Hargrave. He holds the narrow road long enough for the others to withdraw. Hargrave advances to face him alone.

If the rival did not accompany the company, a news card replaces the witnessed scene.

#### Bregga Holt — holt

Voice ID: `sjNdiy7Fr8IefP9EZiow`

**offer**

1. [calm] Bregga Holt. I hire for the Antler.
2. [calm] You have completed enough work to know that a contract and a promise ought to mean the same thing. They do here, on paper at least.
3. [thoughtful] We take lawful clients and criminals. Read the work before you sign. Interested?

**tutorial**

1. [calm] Work comes from this hall now. Not the jobs posted in town. Walk in. Take what is on the board.
2. [flatly] Five jobs. In order. Each one harder than the last.
3. [quietly] Watch our people when you fight. You will see ways of fighting that are not for sale. Only for watching.
4. [calm] Finish all five and the company gives you a full set of our gear. What you learned stays yours.

**decline**

1. [flatly] Suit yourself. The offer stays open. I will not ask again.

**debrief1**

1. [calm] The road contract is closed. The client wants to discuss the bill. They always find the courage afterward.

**debrief2**

1. [thoughtful] Payment is settled. An auditor has asked about Dain's crews. Some serve under Conscript. They did not choose the work.

**debrief3**

1. [quietly] The competing claim is settled. Dain says the contract justified his methods. I do not think a price on paper answers that question.

**debrief4**

1. [sad] I have to close Dain's file. I have not picked up the pen.
2. [quietly] I can miss him and still wish he had listened about Conscript. Both are true.

**why**

1. [tired] I was a soldier for a country that changed its mind about what it wanted from me.
2. [thoughtful] Here the job is written down before I leave. Nobody changes it while I am out there. After a long stretch of the other thing, I would take that over more pay.

#### Dain Roscarrow — roscarrow

Voice ID: `cU2wlHp83CwaYOeqisWW`

**after1**

1. [calm] Dain Roscarrow. I read the road contract. A toll is easy to remove; keeping the next band out takes a company.
2. [playfully] Which is why Holt keeps us. That and our ability to carry furniture.

**after2**

1. [thoughtful] People see a shield and expect you to stand still. The trick is knowing where standing matters.
2. [calm] Come on the next one if you want to see how I work.

**join3**

1. [calm] Keep the contract in mind. Winning a fight in the wrong place can still lose the job.

**banter**

1. [focused] Keep your footing. A shield is useful; falling over behind it is not.
2. [focused] Watch the gaps between us. That is where a company comes apart.

**after3**

1. [quietly] I like having someone beside me who is here by choice.
2. [thoughtful] Yes. I know what that sounds like, coming from me.

**before4**

1. [quietly] Holt thinks a champion is coming for me. She may be right.
2. [calm] Whatever happens, the people on this road still need an escort.

**death**

1. [quietly] Get the others clear. Finish the escort.

**travel**

1. My first company paid us at the gate. I still count heads here, even when there is nobody waiting with a purse.
2. Keep that in mind when the contract gets complicated.

#### Hargrave — holloway

Voice ID: `9dYmrG7ILONuyEDKOapp`

**appear**

1. [angry] Roscarrow. There you are. I came to kill you. What the fuck did you think this was going to be.

**afterKill**

1. [flatly] Conscript made people fight for him without a choice. The divine call named him for it.
2. [quietly] I served beside him once. That did not make this easier, and it did not make those people free.
3. [calm] My call was for him. Take the survivors home.

**facing**

1. [quietly] Crane. I hoped you would bring questions, not swords.
2. [calm] You know why I was called. Killing me will not undo what Dain did.

**sided**

1. [impressed] You actually listened. Nobody listens.
2. [quietly] I am not the good one. I am the one the law sent. That is not the same thing. I killed a man she loved. I would do it again. I still cannot look at her. {target}.
3. [cautiously] Stand on my left. I have been drinking. I will miss things on that side.

**fight**

1. [alarmed] Watch her hands. She is better than me.
2. [desperately] Aldis. Stop. Please stop.
3. [angry] Leave her people. They signed this morning. They will not stop until she says so.

**afterCrane**

1. [sad] We served in the same company. I never wanted it to end here.
2. [quietly] We will release every bound worker and put their names on the books as people owed wages.

**ending**

1. [calm] The company still has contracts to finish. No one will finish them under a binding.
2. [quietly] We will remember Dain and Crane honestly. That includes what we wished they had done differently.

**final**

1. [quietly] Crane. I hoped you would bring questions, not a company armed for me.

**join**

1. [quietly] Thank you for listening before choosing.
2. [calm] I want this to stop. Stay aware of the people she brought; they follow her orders.

#### Aldis Crane — crane

Voice ID: `x19pWgwRCJtbdu9Vc6x2`

**first**

1. [calm] Aldis Crane. They call me First Horn. That is this company's word for the person in charge. It is older than anyone can explain.
2. [flatly] You signed. Here that means something. Everything we are is a promise written down and then kept.
3. [calm] I will not give you a speech about honour. Everything we owe is written down. I have never had to argue about what I meant.
4. [flatly] Take a job. Finish it. That is the welcome. There is no ceremony.

**briefing**

1. [quietly] Sit down. You get the truth before you pick a side.
2. [angry] Dain beat people and made them fight for free so his jobs cost less. That trick is forbidden. It is called Conscript. I never asked why his costs were so low. The world sent a man named Hargrave to stop him. Hargrave killed him. That was legal. They fought in this company together for six years. He knows how we move. The world gave him strength, not skill. If you make him swing more than twice, he gets tired.
3. [angry] Dain and I were together seven years. Nobody in this company knew.
4. [angry] Nobody sanctioned this. This is not company business. I am doing it on my own. Pick a side. {target}.

**sided**

1. [angry] Stay close to me in the fight. Do not stop to decide if this is right.

**fight**

1. [shouts] Left side is open. Move.
2. [angry] He put Dain in the ground. I will put that bitch in one.
3. [shouts] Get up. We are not done. {target}.

**against**

1. [sad] You chose against me. I understand why.
2. [angry] I am still here. If this ends in a fight, then face me.

**afterHolloway**

1. [quietly] Dain is still gone. I knew he would be.
2. [sad] I will have to live with what I asked of you.

**ending**

1. [calm] There will be no bound crews on our books. I should have said that while he could hear it.
2. [quietly] Your place in this company is earned. It is not his place. Nobody can fill that by decree.

**travel**

1. I signed the company through this gate. I am walking through it with you.

**hunt**

1. [quietly] You deserve the truth before you choose.
2. [angry] Dain used Conscript to keep his costs down. I let myself believe the figures because they suited the company.
3. [sad] We were together. I loved him. That does not answer what he did.
4. [calm] I want Hargrave dead. Helping me kill a hero will bring the divine pursuit on us too. Read that part before you sign.

**afterFall**

1. [quietly] Dain is still gone. I knew he would be.
2. [sad] I will have to live with what I asked of you.

### Varenholm Academy (varenholm)

#### Contracts

1. **Practical Assessment** — An unsupervised working is still active in the old quarter. Stop it and recover the student's notes so the Academy can identify the fault.
2. **Unlicensed** — The recovered notation also appears in stolen Academy research. Retrieve the notes from the criminal market before someone repeats the working.
3. **The Word Nobody Says** — The research points to something raised in the old quarter. Investigate its origin. Cassiel can accompany you to examine the magic.
4. **The Choir** — Six risen bodies are operating without a visible caster. Follow the pattern Cassiel identified and find who controls them.
5. **Struck From the Rolls** — The Quiet is using Academy research to attack its people. Venn will join the search. Stop him and recover the dangerous research.

#### Rival death staging

Cassiel catches the first working and turns it aside. Then he sees the second, prepared behind your position. He breaks his own ward to shove you clear.

If the rival did not accompany the company, a news card replaces the witnessed scene.

#### Adept Lirien — lirien

Voice ID: `FrdH3ZxtJH68FtS1KO3y`

**offer**

1. [calm] Adept Lirien, Varenholm Academy. We need field help.
2. [thoughtful] Your record of lawful work qualifies you. You need not pretend to be a graduate.
3. [calm] An unsupervised working has escaped its lesson. We need it stopped before someone calls it a new department. Will you take the work?

**tutorial**

1. [calm] Your jobs come from the Academy now. Not the jobs posted in town. Report here.
2. [flatly] There are five. Take them in order. Each one is harder on purpose.
3. [quietly] You will see spells you cannot buy. Watch during the fights. That is how people who are not students learn anything here.
4. [calm] Finish all five and we give you a full set of Academy gear. Everything you saw stays yours for good.

**decline**

1. [flatly] Noted. The offer stays open. Ask me any time.

**debrief1**

1. [calm] The working is stopped. Cassiel is examining the notes. There is something familiar in the notation.

**debrief2**

1. [thoughtful] The pages are back. They came from restricted research, with the warnings removed. I have sent a copy to the Magister.

**debrief3**

1. [quietly] The raised thing confirms it: this is deliberate. The next report mentions six bodies moving together.

**debrief4**

1. [sad] Cassiel left notes for the next investigation. I keep reaching for them as if she will come in to explain.
2. [quietly] Sit a moment. There is no form you need to fill in for me.

**why**

1. [tired] I am not a gifted mage. I want that said, because everyone works it out.
2. [thoughtful] I am the person who sees trouble three days early. There is one of me for four hundred students. That tells you what this place cares about.

#### Cassiel Vaunt — vaunt

Voice ID: `dTHckwONOUxmkFgArrov`

**after1**

1. [calm] Cassiel Vaunt. I am checking the notes from that working.
2. [annoyed] They copied the containment diagram beautifully. Unfortunately, they copied the coffee stain too.
3. [thoughtful] I want to know where they got the original.

**after2**

1. [thoughtful] These pages belong together. Someone separated the safety instructions from the useful part.
2. [calm] I would like to work with you on the next investigation. You know what the field actually looks like.

**join3**

1. [calm] I will examine the working. Keep an eye on the room while I do. We both need to be able to concentrate.

**banter**

1. [focused] Watch the shape of the working, not just the light.
2. [focused] Keep sight of the casters. The impressive glow is a distraction.

**after3**

1. [warmly] I enjoyed working with you. That is not a mark on an assessment.
2. [playfully] If you visit the library, come find me. I know which chairs are comfortable. Classified information.

**before4**

1. [thoughtful] Six bodies, no caster. Someone wants us looking at the bodies.
2. [calm] Let us take our time before we decide what the spell is doing.

**death**

1. [alarmed] The working is behind us. Move—

**travel**

1. I used to rehearse examinations on the walk to the Academy. Nobody examines what you do when the approved answer fails.
2. Observation before conclusion. That much they taught correctly.

#### The Quiet — quiet

Voice ID: `HMvHZWb0ZWSo5Kc5l22D`

**appear**

1. [calm] Still examining the visible spell. You were taught to look for the caster afterward.

**afterKill**

1. [flatly] I wrote the research you followed. I knew where it would lead you.
2. [angry] They expelled me for raising a body and kept teaching from my notes. Now they will have to explain whose work this is.
3. [calm] Tell Venn I am done asking to be readmitted.

**final**

1. [angry] Magister. Are you here to take the notes or destroy the evidence?
2. [flatly] You could have answered me before any of this.

#### Ilaria Venn — venn

Voice ID: `wq7gzRwr4hAggpoYZh2Q`

**first**

1. [calm] Magister Ilaria Venn. I run this Academy. That mostly means I decide who gets to keep practising and who does not.
2. [thoughtful] I meet every hired outsider once. Most are here for the money. That is an honest reason. It holds up under pressure. The ones who claim something nobler tend to break.
3. [questioning] I do not know you yet. I would like to. Why did you take the job?
4. [calm] Go do a job. Come back and I will ask you the harder one.

**hunt**

1. [quietly] I expelled him. I also let his research stay in circulation. That was my responsibility.
2. [calm] We have the pattern now. We stop him and secure the notes. I am coming with you.

**afterFall**

1. [quietly] Secure the research. No one copies another page until it has been reviewed.
2. [sad] Cassiel should have been the one arguing with me about the precautions.

**ending**

1. [calm] The Academy owes you more than a certificate. Your place here includes the right to ask difficult questions.
2. [quietly] I am keeping Cassiel's desk until her work is properly recorded. Come by when you want to remember her.

**travel**

1. I remember arriving here with a trunk of books. None of them prepared me for this walk.

**fight**

1. [angry] Kill the word before the spell.
2. [flatly] Do not let him finish a sentence. God damn it, hit him.

### The Hollow Bell (bell)

#### Contracts

1. **Paper and Ash** — A scribe is collecting the Bell's names. Stop the leak and recover the list; Obaa-San needs to know how it was assembled.
2. **The One Who Watches** — A watcher has followed the list's route. Find who sent him. Records say this man has been dead for years.
3. **The Left Hand** — The watcher knew a route used by the Bell's Left Hand. Investigate the connection. Suzume can accompany you.
4. **Twenty Years** — A contract leads through another old Bell route. The repeated use of dead agents suggests someone knows the clan's past too well.
5. **The Bell Does Not Ring** — Jiro has returned from an old assassination order. Kaede will confront the consequence of that order beside you.

#### Rival death staging

Your companion checks the passage behind you and catches the first blade. Jiro is already inside the guard. There is only time for a warning.

If the rival did not accompany the company, a news card replaces the witnessed scene.

#### Obaa-San — obaasan

Voice ID: `Dd9rggTUyQrGBAa9A3P7`

**offer**

1. [calm] The paper is for sale. The work is behind the counter.
2. [thoughtful] I am Obaa-San. The Hollow Bell needs people who pay attention before reaching for a knife.
3. [calm] There is a scribe keeping our names. Bring me his list. You may take the contract if you want to join us.

**tutorial**

1. [calm] Your work comes from me now. Come to the shop. Do not take jobs off the town board while you are ours.
2. [flatly] Five contracts. They get worse in order. Do them in order.
3. [quietly] Watch our people fight. You cannot buy what they do — you have to see it done, and then it is yours.
4. [calm] Finish all five and you keep a full set of our gear. Everything you saw stays with you as well.

**decline**

1. [flatly] Then take a sheet on your way out. I will still be here when you change your mind.

**debrief1**

1. [calm] The list is recovered. Someone added names that have not been used in years. That concerns me more than the fresh ones.

**debrief2**

1. [quietly] That watcher was recorded dead. Someone has put him back to work. I have asked Kaede to open the old records.

**debrief3**

1. [thoughtful] The routes connect. This is someone using our own history to approach us.

**debrief4**

1. [sad] Suzume used to arrive through the upstairs window. I have asked people not to close it yet.
2. [quietly] Kaede is here. This time she can tell the old story herself.

**why**

1. [tired] They think the paper is a front. It is not. People need it. I sell it, and I am good at it.
2. [quietly] I have never held a knife. I have sent four hundred people out with one, and I sleep through the night.
3. [calm] That is the work. Not the killing. Coming back, and sleeping after. You will learn it, and you will not notice the day you did.

#### Suzume — suzume

Voice ID: `Hvw50qC2EU36Q5rwuUhg`

**after1**

1. [calm] Suzume. If you hear someone running over the shop, that is usually me.
2. [playfully] The roof is quicker. The stairs are for carrying tea without explaining yourself.

**after2**

1. [thoughtful] A watcher who should be dead. I checked the old route; someone has been using it.
2. [calm] On the next job, I would like another pair of eyes.

**join3**

1. [calm] I will watch ahead. If I come back, let me finish telling you why before we move.

**banter**

1. [focused] Watch the hands. Feet can lie more convincingly.
2. [focused] Keep the approaches in view. A quiet enemy is still an enemy.

**after3**

1. [warmly] I liked having you there. It was good to compare what we saw.
2. [playfully] You can use the stairs when you visit. I will only judge you a little.

**before4**

1. [quietly] Another old route. I have marked where we can turn back.
2. [calm] Whatever is waiting knows the Bell. We should not assume it is waiting alone.

**death**

1. [alarmed] Behind us. Get clear of the passage—

**travel**

1. I carried paper down this street as a child. They taught me to notice which windows opened when I passed.
2. Remember it. Small details keep people alive.

#### Jiro — jiro

Voice ID: `SW9n4bPps5VYGQPnhdgI`

**appear**

1. [quietly] These routes were mine before they were yours.

**afterKill**

1. [flatly] Kaede ordered my death twenty years ago. Someone raised me, and I kept walking after the working ended.
2. [quietly] I asked why. Her people sent knives instead of an answer.
3. [calm] Tell her I am close enough now to ask myself.

**final**

1. [quietly] Kaede. You brought yourself this time.
2. [flatly] Tell me you at least read the order before you signed.

#### Kaede — kaede

Voice ID: `olrUz8V5WoH80Rnq2JOc`

**first**

1. [quietly] I am Kaede. I keep the bell. Every name that goes out of this shop goes out because I said it could.
2. [calm] I have ordered more deaths than anyone in this city, and I have never once raised my voice to do it.
3. [flatly] Obaa-San says you are careful. Do the five contracts. When you have, we will talk about what you are for.

**hunt**

1. [quietly] I signed the order against him. The file survives; the reason in it does not justify the certainty I had.
2. [calm] I let the old routes stay open. Suzume paid for that. We close them and face him together.

**fight**

1. [quietly] Behind him. The dead ones do not turn.
2. [calm] Keep hitting. He does not heal, he only continues.

**afterFall**

1. [sad] I should have answered while he could still hear an answer.
2. [quietly] We are closing those routes. No one else is going out through them.

**ending**

1. [calm] Every old order will be reviewed. Remembering names is not enough if we refuse to remember what we did.
2. [quietly] Suzume has a place in the record as she lived, not just a line about how she died. So do you.

**travel**

1. I used to take this road with someone who knew when to let the silence stand.

### The Green-Eyed (green)

#### Contracts

1. **First Form** — Clear the north road under the clan's writ. Takeda also wants reports of anyone questioning the clan's old enforcement orders.
2. **A Lawful Order** — A summons has been resisted. Enforce the writ and recover the disputed record; the complaint concerns a house the clan burned.
3. **Measured** — The disputed record has divided the clan's officers. Resolve the challenge to the current mission. Ayame can accompany you.
4. **The Widow** — Escort Isamu's cousin along the north road. A survivor of the old fire is targeting the clan; the escort may draw her out.
5. **The Widow's Forms** — Tomoe seeks Isamu over the deaths in the fire. He will face her alongside you. The clan must answer for the order as well as stop the killings.

#### Rival death staging

Your companion recognizes the opening form and moves to intercept. The swordswoman changes the angle at the last step, driving past the guard.

If the rival did not accompany the company, a news card replaces the witnessed scene.

#### Master Takeda — takeda

Voice ID: `R003ylvhf54dw04Zg81Q`

**offer**

1. [calm] Master Takeda, of the Green-Eyed. Your lawful contracts qualify you for our work.
2. [thoughtful] We train people to hold a position when others depend on it. Footwork is part of that. Judgment is the harder part.
3. [calm] There is work on the north road. Take it if you wish to be considered.

**tutorial**

1. [flatly] Your contracts come from this hall. Not the town board. Here.
2. [calm] Five jobs, each harder. Do them in that order. We will see what you are.
3. [thoughtful] Watch how our blades move. You cannot buy those forms. You take them by seeing them done.
4. [calm] Finish, and the clan arms you. That armour says who you belong to. Do not treat it like a gift.

**decline**

1. [flatly] Then you are not a Green Cord and I will not remember your name. The door does not lock behind you.

**debrief1**

1. [calm] The road is clear. The reports mention an old fire. I have asked for the writ that authorized it.

**debrief2**

1. [quietly] The writ was lawful. The complaint about the fire is also true. I will not use one fact to hide the other.

**debrief3**

1. [thoughtful] The officers have their answer for now. Isamu needs to answer the older question himself.

**debrief4**

1. [sad] Ayame questioned an order and still did the work carefully. That took more courage than some of this hall admits.
2. [quietly] I will miss practising with her. Isamu is waiting, and he can wait a little longer.

**why**

1. [tired] I was a poor swordsman and a worse man. This clan gave me a rule I could stand inside. That is all it is.
2. [flatly] When I turn someone away I tell them why. Nobody else in this hall will.
3. [quietly] We serve the law. People write the law. Some of those people are wrong, and we still go. You will have to live with that, or leave.

#### Ayame — ayame

Voice ID: `pFSI8w96hzoslLGuDOEe`

**after1**

1. [formal] Ayame. I train here when I am not on the road.
2. [calm] People watch the blade. I watch where the next step can go.
3. [playfully] Less impressive in a demonstration. Much more useful when the floor is wet.

**after2**

1. [thoughtful] I read the disputed order. I want to hear why it was issued, not just that it bears a seal.
2. [calm] I have asked to accompany you. We should both know what we are enforcing.

**join3**

1. [calm] I will keep an eye on the approach. Tell me if the job stops matching the order.

**banter**

1. [focused] Watch the distance before the blade. That is where the strike begins.
2. [focused] Keep your balance. A beautiful cut is little comfort from the ground.

**after3**

1. [warmly] I was glad you were there. It helps to have someone outside the hall's arguments.
2. [calm] Come practise with me sometime. We can leave the reports outside.

**before4**

1. [quietly] An escort along the same road. I have checked the approach, but I do not like the timing.
2. [calm] Keep the person we are escorting in mind. That is the work.

**death**

1. [alarmed] She is already drawing. Get clear—

**travel**

1. I practised my first form on these steps. The slope shows you which foot you are trusting too much.
2. Then we know something we did not know at the gate.

#### Tomoe — kira

Voice ID: `VIPtPJaY9dPaNIMgAKpr`

**appear**

1. [quietly] Move the escort aside. I am here for the clan that burned my home.

**afterKill**

1. [flatly] Isamu signed the order. My husband and children died in the house.
2. [quietly] I learned the clan's forms because a petition never reached him.
3. [calm] Tell him whose road this has become. I am coming for him.

**final**

1. [angry] Isamu. Will you say their names now that you have to look at me?
2. [quietly] I wanted an answer before I learned how to reach you with a blade.

#### Lord Isamu — isamu

Voice ID: `HYfT8byrXEsuxnJuQWLF`

**first**

1. [formal] I am Isamu. I hold this clan. I answer to the city, and the city answers to no one.
2. [calm] We are not hired swords. Every blade in this hall is sworn. A sworn blade does not ask if the order is wise.
3. [thoughtful] Takeda says you have promise. He is careful with that word. Complete the five.

**hunt**

1. [quietly] I signed the order that destroyed her home. I accepted the city's account without examining it.
2. [calm] She has killed Ayame. We must stop this, and then the order will be opened to the hall. I will answer for my part.

**fight**

1. [formal] Hold the line and let her come to it.
2. [calm] She is fast and she is alone. Use that.

**afterFall**

1. [sad] Ayame should have lived to hear the answer she asked for.
2. [quietly] Bring the order to the hall. No sealed file, no private explanation.

**ending**

1. [calm] The order and the names of those killed will be read before the clan. My signature will remain on it.
2. [quietly] You have earned your place. Keep the judgment that Ayame valued in a companion.

**travel**

1. I have given enough orders from behind these walls. Today I will be where they lead.

### The Red Tally (tally)

#### Contracts

1. **Full Share** — Find where the missing shares went. Cask needs the ledger corrected and the crew paid; he wants the dispute settled rather than another empty berth.
2. **The Factor** — The Factor is withholding payment for cargo. Recover what the contract owes and learn why naval pressure has made him hesitate.
3. **Two Fleets** — Ordell's fleet is competing for the same prize. Settle the claim before the navy closes the channel. Beau can accompany you.
4. **The Prize** — A merchant prize offers a route through the tightening patrols. The escort appears light; inspect what is waiting behind that appearance.
5. **Colours Down** — Kessler is closing the channel on the remaining crews. Saint-Cloud will sail with you to break the interception and get them home.

#### Rival death staging

Beau cuts a fouled rope and kicks it over the rail toward you. The way off the deck opens. He turns to cover the crossing; his opponent is already moving.

If the rival did not accompany the company, a news card replaces the witnessed scene.

#### Quartermaster Cask — hallow

Voice ID: `1csfYuDOypqYwHwYho4k`

**offer**

1. [calm] Cask. I keep the Red Tally's shares. You can sit down; just leave the ledger where it is.
2. [thoughtful] Your criminal work qualifies you. We are pirates, and joining us closes the lawful doors for this life.
3. [calm] The crew needs an honest count even when the cargo is stolen. Want a place on the books?

**tutorial**

1. [calm] Your work comes off my book now, not the town board. Five jobs, and they get bigger.
2. [flatly] One thing before you sign. On this crew you are a criminal for the rest of your life. No navy. No lawful clan. That door shuts tonight.
3. [happily] Watch the crew fight. Half of what they do you cannot buy — you have to see it, then it is yours.
4. [calm] Five jobs and you get a privateer's kit and a full share written in my hand.

**decline**

1. [calm] Sensible. Half the people who sign wish they had said that. The offer stays open — I do not chase.

**debrief1**

1. [calm] The shares are accounted for. The crew needed to see the book checked. Now, there is someone you should meet.

**debrief2**

1. [thoughtful] The payment is settled. The Factor is frightened of the navy. Saint-Cloud is checking the patrol routes.

**debrief3**

1. [calm] The competing claim is settled. The patrols are moving inward. We will need a route for the rest of the crews.

**debrief4**

1. [sad] Beau is gone. I have opened the ledger at his entry three times.
2. [quietly] I keep thinking he will come in and argue about the wording.

**why**

1. [calm] People ask how I square it. I do not. I keep a book. The book is honest even when the fleet is not.
2. [thoughtful] I have written down robberies and killings and every share was right to the coin.
3. [quietly] That is what I am for. Not the taking — the shares. Somebody has to be trusted or this whole thing eats itself.

**introduce**

1. [calm] This is Beau. You will be working together if you stay.

**harness**

1. [flatly] That harness belongs to a deckhand. Stop charging him for repairs.

**checkHarness**

1. [quietly] Leave it with me. I will check the rest.

**tab**

1. [flatly] Your tab first.

**crew**

1. [quietly] No one yet.

**stay**

1. [softly] You can stay here a while.

#### Beau Castell — beau

Voice ID: `wfGL3tJehRI3DoxtsLta`

**after1**

1. [playfully] Beau Castell. Best shot in the fleet. Cask leaves that out because he pays me the same either way.

**after2**

1. [thoughtful] The navy has the Factor nervous. I would rather know where the patrols are than how brave he thinks we are.
2. [playfully] Come on the next prize. You can see whether my stories improve in the telling.

**join3**

1. [calm] Keep an eye on the whole deck. I will watch the guns.

**banter**

1. [focused] Watch your footing. Looking dashing is secondary to having feet.
2. [focused] Keep the lines clear. Tangled equipment is a fucking embarrassing opponent.

**after3**

1. [warmly] Cask is paying out. Come eat with me after.

**before4**

1. [thoughtful] Light escort. Plenty of space to hide more men below.
2. [calm] I will watch the rail. We should know what is on the deck before trusting the manifest.

**death**

1. [alarmed] Over the side! Take the rope—

**travel**

1. My first share bought me a coat. Lost the coat overboard that afternoon. The ledger still calls it a profitable voyage.
2. That sounds like something worth putting in the small print.

**harness**

1. [calm] I am not charging him. Look at the buckle. It would have opened halfway across.

**cantSpare**

1. [playfully] See? Cannot spare me.

**tab**

1. [playfully] I was building up to that.

**seat**

1. [warmly] I will save you a seat.

#### Admiral August Kessler — vanekessler

Voice ID: `KlRlfft1voWiT2Df8TSX`

**appear**

1. [calm] Marines, close the rail. The boarding party has nowhere else to go.

**afterKill**

1. [quietly] He cut the way open for you. I saw it.
2. [calm] Tell Saint-Cloud the channel is closed. She can bring her ships in or come and dispute it herself.

**final**

1. [calm] Captain Saint-Cloud. I offered you a surrender.
2. [flatly] I cannot keep trade moving while your fleet takes its cargo. You knew that before you sailed.

#### Captain Meriel Saint-Cloud — saintcloud

Voice ID: `Kexq2CdSapm18RMWwloT`

**first**

1. [calm] Meriel Saint-Cloud. I command this fleet. I do not raise my voice on a deck. I have not needed to.
2. [quietly] There is an admiral out there who writes to me. Courteous letters. He hangs my captains and describes each one.
3. [calm] Do Cask's five jobs. Then we will talk about the letter he has not sent yet.

**hunt**

1. [quietly] Kessler is closing the channel. If we leave the crews there, Beau will not be the last name Cask has to close.
2. [calm] I am sailing with you. We break the interception and bring them home.

**fight**

1. [angry] Keep off his reach. Everything you give him he throws the fuck back.
2. [flatly] Shoot him. From the back of the deck. Do not go near him.
3. [angry] What the hell are you waiting for. Take the officer.

**afterFall**

1. [calm] The ships can clear the channel now. Send the signal.
2. [quietly] I wish Beau were here to make an outrageous claim about his contribution.

**ending**

1. [calm] The shallows are open for now. The empire still has ships; this buys our crews a way home.
2. [quietly] When you are ready, come stand with us when we say goodbye to Beau. You have a place with the crew.

**travel**

1. I know what the ledger says this voyage costs. I want to see who comes back to collect.

**crew**

1. [quietly] Who has told the crew?

**tellCrew**

1. [quietly] I will do it.

### The Admiralty (navy)

#### Contracts

1. **Rated Hand** — Clear the smugglers' route through the shallows and recover their sailing papers. Crell wants to know how they avoided the patrol.
2. **A Lawful Prize** — The papers identify a captain carrying cargo without clearance. Settle the seizure and examine the route; coastal villages depend on these shipments too.
3. **Two Commands** — Two officers dispute how the route should be patrolled. Resolve the command problem. Merrow can accompany you to examine the water herself.
4. **Nine Engagements** — Patrol the revised route. Ash has avoided the obvious channels, and Merrow suspects he has learned the navy's schedule.
5. **The Tenth** — Ash used the patrol schedule to strike. Kessler will join the pursuit. End the raids and reopen the route for civilian cargo.

#### Rival death staging

Merrow spots the second boarding party and hauls the crossing line clear. Her warning gives you a way off. She turns back toward the other rail.

If the rival did not accompany the company, a news card replaces the witnessed scene.

#### Boatswain Crell — crell

Voice ID: `u90bBWOV7gURzqtsMjBN`

**offer**

1. [calm] Boatswain Crell. Your lawful work qualifies you to sign on.
2. [thoughtful] We keep cargo moving through these waters. Sometimes that means shooting. Usually it means finding out why the shooting started.
3. [calm] King's pay, naval orders, and no criminal contracts while you serve. Read that before you make your mark.

**tutorial**

1. [calm] Your orders come from this room now. Not the town board. From me, in order.
2. [flatly] Five commissions. They get worse. Do not skip and do not volunteer.
3. [tired] Watch the officers work. Half of what they do is not in any manual. You learn it by being there.
4. [calm] Finish the five and you are warranted — King's uniform, and whatever you picked up along the way.

**decline**

1. [calm] Right you are. The book stays open on the desk and I am always here. I have nowhere else to be and no sea legs left to take me.

**debrief1**

1. [calm] The route is cleared. Merrow is checking the papers. The old chart is making this harder than it needs to be.

**debrief2**

1. [quietly] The seizure is settled. The captain named the village expecting that cargo. I have passed it to the Admiral, not just the filing clerk.

**debrief3**

1. [calm] The command dispute is settled. Merrow has a revised route. She wants it checked on the water before anyone calls it safe.

**debrief4**

1. [sad] Merrow left a correction on my desk. I was going to tease her about the handwriting.
2. [quietly] I have not moved it. Sit a moment if you need to.

**why**

1. [tired] I have drowned twice and signed on again both times. People laugh. It is not a joke.
2. [quietly] The sea does not care about our papers. We pretend it does, and because we pretend hard enough, cargo moves and people eat.
3. [calm] That is worth going under for. I have not decided if it is worth going under again.

#### Lieutenant Isolde Merrow — fane

Voice ID: `fazkFGFrALkyPulDqqzW`

**after1**

1. [formal] Lieutenant Isolde Merrow. I am reviewing the patrol reports.
2. [thoughtful] The official chart has a sandbar where the deep channel is. An impressive place to put the ink.
3. [calm] I would like the next report to come from someone who was actually there.

**after2**

1. [thoughtful] The cargo was bound for a village. The seizure may be lawful, but the village still needs to eat.
2. [calm] I have asked to see the route with you before another order is written.

**join3**

1. [calm] I will watch the approach. Tell me what the chart gets wrong.

**banter**

1. [focused] Keep the approaches in sight. Watch for the move behind the obvious one.
2. [focused] Mind the spacing. We need room to work without leaving gaps.

**after3**

1. [warmly] I enjoyed working with you. That part is not going in the formal report.
2. [playfully] Come by when I am off duty. I can discuss something other than shipping. I would appreciate the practice.

**before4**

1. [thoughtful] The patrols are too predictable. If we can read the schedule, so can Ash.
2. [calm] Keep an eye beyond the usual approach.

**death**

1. [alarmed] The other rail! Get off the crossing—

**travel**

1. My first posting was at the harbor chain. I thought the ships were the whole world. Mostly I learned to wait.
2. We will account for it before we commit.

#### Dorian Ash — ash

Voice ID: `C34VRFVgUY3W0ZIN2NQ5`

**appear**

1. [playfully] Right on schedule. What the hell did you expect from a very orderly navy.

**afterKill**

1. [quietly] She saw the second boarding party. Most officers kept watching me.
2. [calm] Take that home with you. Tell the Admiral his schedule is no longer his alone. God damn it, he should have listened.

**final**

1. [playfully] Admiral. A different route this time. Someone finally changed the fucking orders.
2. [calm] You still have to take the deck from me.

#### Admiral August Kessler — vanekessler

Voice ID: `KlRlfft1voWiT2Df8TSX`

**first**

1. [calm] Admiral August Kessler. A foreign empire pays this fleet to keep trade moving. That is the instruction. I have never needed another.
2. [flatly] I have hanged pirate captains. I did not enjoy it. I still fucking did it. Decide now if you can serve under that.
3. [thoughtful] Crell says you can take an order. Do the five commissions. Then we will talk about the man who keeps beating this fleet.

**hunt**

1. [quietly] Merrow warned us about the schedule. I should have acted sooner.
2. [calm] We have changed the patrols. Now we go after the man using them against us. I am coming with you.

**fight**

1. [angry] Close order. Nothing gets between the lanes.
2. [flatly] Do not listen to that son of a bitch. Shoot him.
3. [angry] God damn it, hold the line. If he talks, he is buying a shot.

**afterFall**

1. [calm] Signal the patrol. The cargo route can reopen.
2. [sad] Merrow should have been here to correct the report. Write it properly anyway.

**ending**

1. [calm] The north-coast cargo will have an escort. The village gets its supplies, and the patrol charts will be corrected.
2. [quietly] Your service is recorded beside hers. She wanted the work done properly. You helped us do that.

**travel**

1. I have watched ships leave from this quay for years. It looks different from the departing side.

## Alternating scene order

### tally:beau:after1

1. **Quartermaster Cask → Player**: `introduce` — Caption: Beau is checking a boarding harness beside the ledger.
2. **Beau Castell → Player**: `after1`
3. **Quartermaster Cask → Beau Castell**: `harness`
4. **Beau Castell → Quartermaster Cask**: `harness`
5. **Quartermaster Cask → Beau Castell**: `checkHarness`
6. **Beau Castell → Player**: `cantSpare`

### tally:beau:after3

1. **Beau Castell → Player**: `after3`
2. **Quartermaster Cask → Beau Castell**: `tab`
3. **Beau Castell → Quartermaster Cask**: `tab`
4. **Beau Castell → Player**: `seat`

### tally:hallow:debrief4

1. **Quartermaster Cask → Player**: `debrief4` — Caption: Cask closes the ledger. Saint-Cloud joins you.
2. **Captain Meriel Saint-Cloud → Quartermaster Cask**: `crew`
3. **Quartermaster Cask → Captain Meriel Saint-Cloud**: `crew`
4. **Captain Meriel Saint-Cloud → Quartermaster Cask**: `tellCrew`
5. **Quartermaster Cask → Player**: `stay`

## Other named recordings

