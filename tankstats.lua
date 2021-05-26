


function _Round(num, decimalPlaces)
    if not num then
        return 0
    end
    local mult = 10^(decimalPlaces)
    return math.floor(num * mult + 0.5) / mult;
    
end

function _getPlayerDefense()
    
    local baseDefense, armorDefense = UnitDefense("player");
    return baseDefense + armorDefense;
    
    --local numSkills = GetNumSkillLines()
    
    --local skillIndex = 0
    --for i = 1, numSkills do
    --    local skillName = select(1, GetSkillLineInfo(i))
    --    local isHeader = select(2, GetSkillLineInfo(i))
    --    
    --    if (isHeader == nil or (not isHeader)) and (skillName == DEFENSE) then
    --        skillIndex = i
    --        break;
    --    end
    --end
    
    --local skillRank = 0
    --local skillModifier = 0
    --local totalDefense = 0
    --if (skillIndex > 0) then
    --    skillRank = select(4, GetSkillLineInfo(skillIndex))
    --    skillModifier = select(6, GetSkillLineInfo(skillIndex))
    --    --totalDefense = skillRank + skillModifier;
    --end
    --print(skillRank + skillModifier);
    --return totalDefense;
    --return skillRank + skillModifier;
end

function _displayAllSkills()
    
    for skillIndex = 1, GetNumSkillLines() do
        local skillName, isHeader, isExpanded, skillRank, numTempPoints, skillModifier,
        skillMaxRank, isAbandonable, stepCost, rankCost, minLevel, skillCostType,
        skillDescription = GetSkillLineInfo(skillIndex)
        if not isHeader then
            print(string.format("Skill: %s - %s", skillName, skillRank))
        end
    end    
    
end

function _getMissChance(skillDifference)
    
    
    local miss = math.max(5.0 + (skillDifference * 0.04),0);
    return _Round(miss, 2);
    
end

function _getDodgeChance(levelDifference)
    
    return math.max(_Round(GetDodgeChance() + (levelDifference * 5 * 0.04), 2),0);
end

local function _getParryChance(levelDifference)
    
    return math.max(_Round(GetParryChance() + (levelDifference * 5 * 0.04), 2),0);
end

function _getBlockChance(levelDifference)
    
    return math.max(_Round(GetBlockChance() + (levelDifference * 5 * 0.04), 2),0);
end

function _getArmorDamageReduction(mobLevel)
    --$C$6/($C$6+400+85*$C$2)    
    --local baseArmor , effectiveArmor, armor, posBuff, negBuff = UnitArmor("player");
    --message("Your current armor is " .. effectiveArmor .. " (base is " .. baseArmor .. ")");
    local baseArmor , effectiveArmor, armor, posBuff, negBuff = UnitArmor("player");
    --local dr = effectiveArmor / (effectiveArmor + 400 + (85 * mobLevel));
    local dr = effectiveArmor / (effectiveArmor + 400 + 85 * ((5.5 * mobLevel) - 265.5));
    return _Round(min(dr,0.75)*100,2);
end

function _getCritChance(skillDifference)
    
    local crit = 5.0 - (skillDifference * 0.04);
    return math.max(_Round(crit, 2),0);
    
end

function _getCrushChance(levelDifference)
    
    if levelDifference < 3 then
        math.max(0,0);
    end
    
    local crush = (-10 * levelDifference) - 15;
    return math.max(_Round(crush, 2),0);
    
end

function _getAttackTable(skillDifference, levelDifference)
    
    local raws = {
        _getMissChance(skillDifference), 
        _getDodgeChance(levelDifference), 
        _getParryChance(levelDifference),
        _getBlockChance(levelDifference),
        _getCritChance(skillDifference),
        _getCrushChance(levelDifference),
        _Round(0.00,2);
    }
    
    --druid bear tanks have 0.00% block and parry chances
    local localizedClass, englishClass, classIndex = UnitClass("player");
    if englishClass == "DRUID" then
        raws[3] = _Round(0,2);
        raws[4] = _Round(0,2);
    end
    
    --check if shield is equipped. No shield -> 0.00% block chance
    if not IsEquippedItemType("Shields") then
        raws[4] = _Round(0,2);
    end
    
    local sum = 0.0;
    --print("raw");
    for i = 1, 6,1 do
        --print(raws[i]);
        sum = sum + raws[i];
    end
    
    
    raws[7] = _Round(100 - sum,2);
    
    
    for i = 6, 1, -1 do
        
        raws[i] = _Round(raws[i] + raws[i+1],2);
        
    end
    
    for i = 1, 7 do
        
        raws[i] = _Round(max(raws[i], 0),2);
        --print(raws[i]);
    end
    
    
    
    local results = {0.0,0.0,0.0,0.0,0.0,0.0,raws[7],0};
    
    for i = 6, 1, -1 do       
        results[i] = _Round(raws[i] - raws[i+1],2);
    end 
    results[7] = _Round(results[7],2);
    return results;
    
end

function _storeResults(results)
    
    if results == nil or aura_env == nil then
        return;
        
    end
    
    aura_env.cMiss = results[1];
    aura_env.cDodge = results[2];
    aura_env.cParry = results[3];
    aura_env.cBlock = results[4];
    aura_env.cCrit = results[5];
    aura_env.cCrush = results[6];
    aura_env.cNormal = results[7];
    aura_env.cArmorDR = results[8];
    
end


function _printAttackTable(results)
    
    print("--TRUE ATTACK TABLE--");
    print("Miss Chance: ",results[1]);
    print("Dodge Chance: ", results[2]);
    print("Parry Chance: ", results[3]);
    print("Block Chance: ",results[4] );
    print("Crit Chance: ", results[5]);
    print("Crushing Blow Chance: ", results[6]);
    print("Normal Hit Chance: ", results[7]);
    print("Armor DR: ", results[8]);    
end

function _printAttackTableFromEnv()
    
    print("--TRUE ATTACK TABLE--");
    print("Miss Chance: ", aura_env.cMiss);
    print("Dodge Chance: ", aura_env.cDodge);
    print("Parry Chance: ", aura_env.cParry);
    print("Block Chance: ",aura_env.cBlock);
    print("Crit Chance: ", aura_env.cCrit);
    print("Crushing Blow Chance: ", aura_env.cCrush);
    print("Normal Hit Chance: ", aura_env.cNormal);    
end

function _updateAttackTable(mobLevel)
    if mobLevel < 0
    then
        mobLevel = UnitLevel("player")+3;    
    end
    
    local playerDefenseSkill = _getPlayerDefense();
    local mobWeaponSkill = mobLevel * 5;
    local levelDifference = UnitLevel("player") - mobLevel;
    local skillDifference = playerDefenseSkill - mobWeaponSkill;
    local results = _getAttackTable(skillDifference, levelDifference);
    results[8] =  _getArmorDamageReduction(mobLevel);
    _storeResults(results);
    --_printAttackTable(results);
    --print("updated tank table!");
    --dr = _getArmorDamageReduction(mobLevel);
    --print(dr);
    --aura_env.cArmorDR = _getArmorDamageReduction(mobLevel);
    
end

--MAIN CODE

print("Initializing Tank Table WA!");
aura_env.prevTargetGUID = 0;
aura_env.cArmorDR = 0;
aura_env.cMiss = 0;
aura_env.cDodge = 0;
aura_env.cParry = 0;
aura_env.cBlock = 0;
aura_env.cCrit = 0;
aura_env.cCrush = 0;
aura_env.cNormal = 0;

_updateAttackTable(UnitLevel("player"));



